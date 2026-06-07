from collections import defaultdict

from sqlalchemy import or_, select
from sqlalchemy.orm import Session, joinedload

from app.models.ticket import Ticket, TicketStatus
from app.models.ticket_analysis import TicketAnalysis
from app.models.user import User, UserRole
from app.schemas.triage import (
    IncidentGroupSuggestion,
    IncidentRelatedTicket,
    RoutingRecommendation,
    TriageOverviewResponse,
    TriageSummary,
    TriageTicketItem,
)

ACTIVE_STATUSES = {
    TicketStatus.NEW,
    TicketStatus.ANALYZING,
    TicketStatus.OPEN,
    TicketStatus.IN_PROGRESS,
}


class TriageService:
    @staticmethod
    def get_overview(db: Session, current_user: User) -> TriageOverviewResponse:
        tickets = TriageService._visible_tickets(db, current_user)
        active_tickets = [ticket for ticket in tickets if ticket.status in ACTIVE_STATUSES]

        critical_queue = sorted(
            [
                ticket
                for ticket in active_tickets
                if ticket.analysis
                and (
                    ticket.analysis.priority == "high"
                    or ticket.analysis.priority_score >= 70
                )
            ],
            key=lambda ticket: (
                -(ticket.analysis.priority_score if ticket.analysis else 0),
                ticket.created_at,
            ),
        )[:10]

        low_confidence_cases = sorted(
            [
                ticket
                for ticket in active_tickets
                if ticket.analysis and ticket.analysis.category_confidence < 0.6
            ],
            key=lambda ticket: (
                ticket.analysis.category_confidence if ticket.analysis else 1,
                ticket.created_at,
            ),
        )[:10]

        possible_incident_groups = TriageService._incident_suggestions(active_tickets)
        routing_recommendations = TriageService._routing_recommendations(active_tickets)[:10]
        recent_tickets = sorted(tickets, key=lambda ticket: ticket.created_at, reverse=True)[:10]

        return TriageOverviewResponse(
            summary=TriageSummary(
                total_open=len(active_tickets),
                high_priority=len(critical_queue),
                low_confidence=len(low_confidence_cases),
                possible_incidents=len(possible_incident_groups),
            ),
            critical_queue=[TriageService._ticket_item(ticket) for ticket in critical_queue],
            low_confidence_cases=[TriageService._ticket_item(ticket) for ticket in low_confidence_cases],
            possible_incident_groups=possible_incident_groups,
            routing_recommendations=routing_recommendations,
            recent_tickets=[TriageService._ticket_item(ticket) for ticket in recent_tickets],
        )

    @staticmethod
    def _visible_tickets(db: Session, current_user: User) -> list[Ticket]:
        statement = (
            select(Ticket)
            .options(joinedload(Ticket.analysis))
            .outerjoin(TicketAnalysis)
            .order_by(Ticket.created_at.desc())
            .limit(250)
        )
        if current_user.role == UserRole.STAFF:
            statement = statement.where(
                or_(
                    Ticket.assigned_department.is_(None),
                    Ticket.assigned_department == current_user.department,
                    TicketAnalysis.suggested_department == current_user.department,
                )
            )
        return list(db.execute(statement).scalars().all())

    @staticmethod
    def _ticket_item(ticket: Ticket) -> TriageTicketItem:
        analysis = ticket.analysis
        return TriageTicketItem(
            id=ticket.id,
            title=ticket.title,
            description=ticket.description,
            status=ticket.status,
            assigned_department=ticket.assigned_department,
            category=ticket.manual_category or (analysis.predicted_category if analysis else None),
            category_label=analysis.category_label if analysis else None,
            priority=ticket.manual_priority or (analysis.priority if analysis else None),
            priority_score=analysis.priority_score if analysis else None,
            category_confidence=analysis.category_confidence if analysis else None,
            suggested_department=analysis.suggested_department if analysis else None,
            created_at=ticket.created_at,
            updated_at=ticket.updated_at,
        )

    @staticmethod
    def _incident_suggestions(tickets: list[Ticket]) -> list[IncidentGroupSuggestion]:
        suggestions: list[IncidentGroupSuggestion] = []
        by_category: dict[str, list[Ticket]] = defaultdict(list)

        for ticket in tickets:
            analysis = ticket.analysis
            if not analysis:
                continue
            by_category[analysis.predicted_category].append(ticket)
            candidates = [
                candidate
                for candidate in analysis.duplicate_candidates
                if float(candidate.get("similarity", 0)) >= 0.45
            ]
            if not candidates:
                continue
            related = [
                IncidentRelatedTicket(
                    ticket_id=str(ticket.id),
                    title=ticket.title,
                    similarity=1.0,
                    reason="Ticket trung tâm của gợi ý nhóm.",
                )
            ]
            related.extend(
                IncidentRelatedTicket(
                    ticket_id=str(candidate.get("ticket_id", "")),
                    title=str(candidate.get("title", "Ticket liên quan")),
                    similarity=round(float(candidate.get("similarity", 0)), 3),
                    reason="AI duplicate detection phát hiện nội dung liên quan.",
                )
                for candidate in candidates[:4]
            )
            average_similarity = sum(item.similarity for item in related) / len(related)
            suggestions.append(
                IncidentGroupSuggestion(
                    group_key=f"dup-{ticket.id}",
                    title=f"Nhóm phản ánh liên quan: {ticket.title[:60]}",
                    category=analysis.predicted_category,
                    average_similarity=round(average_similarity, 3),
                    related_count=len(related),
                    related_tickets=related,
                    recommendation="Nên xem xét gom các phản ánh liên quan để xử lý tập trung.",
                )
            )

        if len(suggestions) < 3:
            for category, category_tickets in by_category.items():
                if len(category_tickets) < 3:
                    continue
                related = [
                    IncidentRelatedTicket(
                        ticket_id=str(ticket.id),
                        title=ticket.title,
                        similarity=0.65,
                        reason="Cùng nhóm AI category và đang mở.",
                    )
                    for ticket in category_tickets[:4]
                ]
                suggestions.append(
                    IncidentGroupSuggestion(
                        group_key=f"category-{category}",
                        title=f"Cụm phản ánh {category}",
                        category=category,
                        average_similarity=0.65,
                        related_count=len(category_tickets),
                        related_tickets=related,
                        recommendation="Có nhiều phản ánh cùng nhóm, nên rà soát xem có phải một sự cố chung.",
                    )
                )
                if len(suggestions) >= 5:
                    break

        return suggestions[:5]

    @staticmethod
    def _routing_recommendations(tickets: list[Ticket]) -> list[RoutingRecommendation]:
        recommendations: list[RoutingRecommendation] = []
        for ticket in tickets:
            analysis = ticket.analysis
            if not analysis or not analysis.suggested_department:
                continue
            if ticket.assigned_department == analysis.suggested_department:
                continue
            recommendations.append(
                RoutingRecommendation(
                    ticket=TriageService._ticket_item(ticket),
                    recommended_department=analysis.suggested_department,
                    reason="AI đề xuất phòng ban xử lý nhưng ticket chưa được gán đúng phòng.",
                )
            )
        return sorted(
            recommendations,
            key=lambda item: (-(item.ticket.priority_score or 0), item.ticket.created_at),
        )
