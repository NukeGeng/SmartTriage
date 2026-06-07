from pathlib import Path
from typing import Any

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.core.config import settings
from app.ml.preprocessing import combine_title_description


class DuplicateDetector:
    def __init__(self, index_path: str | None = None) -> None:
        self.index_path = Path(index_path or settings.DUPLICATE_INDEX_PATH)

    def find_duplicates(
        self,
        ticket_id: str,
        title: str,
        description: str,
        top_k: int = 3,
        threshold: float = 0.45,
        existing_tickets: list[dict[str, Any]] | None = None,
    ) -> list[dict]:
        if existing_tickets:
            return self.find_duplicates_from_items(
                title=title,
                description=description,
                existing_tickets=existing_tickets,
                top_k=top_k,
                threshold=threshold,
                exclude_ticket_id=ticket_id,
            )
        return self._find_duplicate_rows(
            ticket_id=ticket_id,
            title=title,
            description=description,
            tickets=self._load_index(),
            top_k=top_k,
            threshold=threshold,
        )

    def find_duplicates_from_items(
        self,
        title: str,
        description: str,
        existing_tickets: list[dict[str, Any]],
        top_k: int = 3,
        threshold: float = 0.45,
        exclude_ticket_id: str | None = None,
    ) -> list[dict]:
        return self._find_duplicate_rows(
            ticket_id=exclude_ticket_id,
            title=title,
            description=description,
            tickets=existing_tickets,
            top_k=top_k,
            threshold=threshold,
        )

    def _find_duplicate_rows(
        self,
        ticket_id: str | None,
        title: str,
        description: str,
        tickets: list[dict[str, Any]],
        top_k: int,
        threshold: float,
    ) -> list[dict]:
        if not tickets:
            return []
        rows = [
            ticket
            for ticket in tickets
            if (ticket_id is None or str(ticket.get("ticket_id")) != str(ticket_id))
            and ticket.get("title")
            and ticket.get("description")
        ]
        if not rows:
            return []

        corpus = [
            combine_title_description(str(row["title"]), str(row["description"]))
            for row in rows
        ]
        new_text = combine_title_description(title, description)
        vectorizer = TfidfVectorizer(max_features=3000, ngram_range=(1, 2))
        matrix = vectorizer.fit_transform(corpus + [new_text])
        similarities = cosine_similarity(matrix[-1], matrix[:-1]).flatten()

        candidates = []
        for row, similarity in zip(rows, similarities, strict=False):
            if similarity >= threshold:
                candidates.append(
                    {
                        "ticket_id": str(row["ticket_id"]),
                        "title": str(row["title"]),
                        "similarity": round(float(similarity), 3),
                    }
                )
        return sorted(candidates, key=lambda item: item["similarity"], reverse=True)[:top_k]

    def _load_index(self) -> list[dict[str, Any]]:
        if not self.index_path.exists():
            return []
        df = pd.read_csv(self.index_path)
        return df.to_dict(orient="records")
