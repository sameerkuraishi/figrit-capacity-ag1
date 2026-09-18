import math
import os
import re
from collections import Counter
from typing import Iterable

from .models import KnowledgeDocument

TOKEN_RE = re.compile(r"[a-zA-Z0-9]+")


def tokenize(text: str) -> list[str]:
    return [token.lower() for token in TOKEN_RE.findall(text or "") if len(token) > 1]


def _tfidf_vector(tokens: list[str], idf: dict[str, float]) -> dict[str, float]:
    counts = Counter(tokens)
    if not counts:
        return {}
    max_count = max(counts.values())
    return {term: (count / max_count) * idf.get(term, 0.0) for term, count in counts.items()}


def _cosine(a: dict[str, float], b: dict[str, float]) -> float:
    common = set(a) & set(b)
    numerator = sum(a[t] * b[t] for t in common)
    norm_a = math.sqrt(sum(v * v for v in a.values()))
    norm_b = math.sqrt(sum(v * v for v in b.values()))
    if not norm_a or not norm_b:
        return 0.0
    return numerator / (norm_a * norm_b)


def retrieve(question: str, course_id: int | None = None, limit: int = 3) -> list[dict]:
    qs = KnowledgeDocument.objects.all()
    if course_id:
        scoped = qs.filter(course_id=course_id)
        if scoped.exists():
            qs = scoped

    docs = list(qs[:100])
    if not docs:
        return []

    document_tokens = [tokenize(doc.content + " " + doc.title) for doc in docs]
    query_tokens = tokenize(question)
    doc_count = len(document_tokens)
    df = Counter()
    for toks in document_tokens:
        for term in set(toks):
            df[term] += 1
    idf = {term: math.log((1 + doc_count) / (1 + freq)) + 1 for term, freq in df.items()}

    query_vec = _tfidf_vector(query_tokens, idf)
    scored = []
    for doc, toks in zip(docs, document_tokens):
        score = _cosine(query_vec, _tfidf_vector(toks, idf))
        scored.append((score, doc))
    scored.sort(key=lambda row: row[0], reverse=True)

    return [
        {
            "title": doc.title,
            "source": doc.source_label or doc.title,
            "content": doc.content,
            "score": round(score, 4),
        }
        for score, doc in scored[:limit]
        if score > 0 or len(scored) <= limit
    ]


def _extractive_answer(question: str, passages: Iterable[dict]) -> str:
    passages = list(passages)
    if not passages:
        return (
            "I could not find a grounded answer in the training knowledge base. "
            "Please ask your trainer or upload relevant study material first."
        )
    best = passages[0]
    sentences = re.split(r"(?<=[.!?])\s+", best["content"].strip())
    q_terms = set(tokenize(question))
    ranked = sorted(
        sentences,
        key=lambda sentence: len(q_terms & set(tokenize(sentence))),
        reverse=True,
    )
    chosen = [s for s in ranked[:3] if s]
    return " ".join(chosen)[:1200]


def grounded_answer(question: str, passages: list[dict]) -> tuple[str, bool]:
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        return _extractive_answer(question, passages), False

    context = "\n\n".join(
        f"SOURCE: {p['source']}\n{p['content'][:2200]}" for p in passages
    )
    prompt = f"""
You are FIGR.IT, a learning assistant for an organizational capacity-building portal.
Answer ONLY from the retrieved training context below. If the context is insufficient,
say that clearly. Do not invent official operational procedures. Keep the answer concise,
student-friendly, and include a short 'Next step' when useful.

QUESTION:
{question}

RETRIEVED CONTEXT:
{context}
""".strip()

    try:
        from openai import OpenAI

        client = OpenAI(api_key=api_key)
        model = os.getenv("OPENAI_MODEL", "gpt-5.6-luna")
        response = client.responses.create(model=model, input=prompt)
        text = getattr(response, "output_text", "") or ""
        if text.strip():
            return text.strip(), True
    except Exception:
        pass

    return _extractive_answer(question, passages), False
