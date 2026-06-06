from app.schemas.analyze import AnalyzeTicketRequest
from app.services.analysis_service import AnalysisService


def test_analysis_service_returns_complete_response(tmp_path) -> None:
    service = AnalysisService()
    payload = AnalyzeTicketRequest(
        ticket_id="TCK-001",
        title="Không đăng nhập được hệ thống thi online",
        description="Em không thể đăng nhập, sáng mai có lịch thi nên cần hỗ trợ gấp.",
        open_tickets=[
            {
                "ticket_id": "TCK-OLD",
                "title": "Lỗi đăng nhập hệ thống thi online",
                "description": "Không thể đăng nhập vào hệ thống thi.",
                "category": "account_system",
            }
        ],
    )

    result = service.analyze(payload)

    assert result.category == "account_system"
    assert result.priority == "high"
    assert result.suggested_department == "Phòng CNTT"
    assert result.suggested_actions
    assert result.model_version
