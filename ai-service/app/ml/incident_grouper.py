from typing import Any

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.ml.preprocessing import combine_title_description


def _category_close(new_category: str | None, existing_category: str | None) -> bool:
    if not new_category or not existing_category:
        return True
    return new_category == existing_category


def _group_title(title: str, category: str | None) -> str:
    if category == "network":
        return "Sự cố Wifi / mạng đang được phản ánh"
    if category == "account_system":
        return "Sự cố tài khoản / hệ thống"
    if category == "classroom_device":
        return "Sự cố thiết bị phòng học"
    return f"Nhóm phản ánh cùng chủ đề: {title[:60]}"


def suggest_incident_group(
    new_ticket: dict[str, Any],
    existing_tickets: list[dict[str, Any]],
    threshold: float = 0.65,
    top_k: int = 5,
) -> dict[str, Any]:
    title = str(new_ticket.get("title", ""))
    description = str(new_ticket.get("description", ""))
    category = new_ticket.get("category")
    rows = [
        ticket
        for ticket in existing_tickets
        if ticket.get("title")
        and ticket.get("description")
        and str(ticket.get("id") or ticket.get("ticket_id")) != str(new_ticket.get("id") or new_ticket.get("ticket_id"))
    ]
    if not rows:
        return {
            "has_incident_suggestion": False,
            "suggested_group_title": "",
            "suggested_category": category,
            "average_similarity": 0.0,
            "related_tickets": [],
            "recommendation": "Chưa đủ phản ánh đang mở để gợi ý nhóm sự cố.",
        }

    corpus = [
        combine_title_description(str(row["title"]), str(row["description"]))
        for row in rows
    ]
    new_text = combine_title_description(title, description)
    vectorizer = TfidfVectorizer(max_features=3000, ngram_range=(1, 2))
    matrix = vectorizer.fit_transform(corpus + [new_text])
    similarities = cosine_similarity(matrix[-1], matrix[:-1]).flatten()

    related = []
    for row, similarity in zip(rows, similarities, strict=False):
        row_category = row.get("category")
        if similarity < threshold or not _category_close(category, row_category):
            continue
        related.append(
            {
                "ticket_id": str(row.get("id") or row.get("ticket_id")),
                "title": str(row["title"]),
                "similarity": round(float(similarity), 3),
                "reason": "Cùng chủ đề theo TF-IDF cosine similarity và category gần nhau.",
            }
        )

    related = sorted(related, key=lambda item: item["similarity"], reverse=True)[:top_k]
    average_similarity = (
        round(sum(item["similarity"] for item in related) / len(related), 3)
        if related
        else 0.0
    )
    has_suggestion = len(related) >= 2

    return {
        "has_incident_suggestion": has_suggestion,
        "suggested_group_title": _group_title(title, str(category) if category else None) if has_suggestion else "",
        "suggested_category": category,
        "average_similarity": average_similarity,
        "related_tickets": related,
        "recommendation": (
            "Nên gom các phản ánh này thành một nhóm sự cố để xử lý tập trung."
            if has_suggestion
            else "Các phản ánh liên quan chưa đủ mạnh để tạo nhóm sự cố."
        ),
    }
