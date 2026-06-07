import re

URL_RE = re.compile(r"https?://\S+|www\.\S+", flags=re.IGNORECASE)
EMAIL_RE = re.compile(r"\b[\w.+-]+@[\w.-]+\.\w+\b", flags=re.IGNORECASE)
PUNCTUATION_RE = re.compile(r"[^\w\sÀ-ỹ]", flags=re.UNICODE)
WHITESPACE_RE = re.compile(r"\s+")


def normalize_text(text: str) -> str:
    value = text.lower().strip()
    value = URL_RE.sub(" ", value)
    value = EMAIL_RE.sub(" ", value)
    value = PUNCTUATION_RE.sub(" ", value)
    value = WHITESPACE_RE.sub(" ", value)
    return value.strip()


def combine_title_description(title: str, description: str) -> str:
    return normalize_text(f"{title} {description}")
