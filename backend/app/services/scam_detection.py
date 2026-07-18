"""
Digital Arrest / Scam-Call Detection Agent.

Hackathon-real implementation: a transparent, explainable rule + similarity
based scorer (no heavyweight model download required to run). The interface
is designed so a production team can swap in Whisper (for audio -> transcript)
and Sentence-Transformers + FAISS (for the similarity step) without changing
the API contract — see comments marked PRODUCTION UPGRADE.
"""
from __future__ import annotations

import re
from collections import Counter

import numpy as np

from app.data.scam_corpus import (
    KNOWN_SCAM_SCRIPTS,
    THREAT_KEYWORDS,
    URGENCY_KEYWORDS,
    SECRECY_KEYWORDS,
    PAYMENT_KEYWORDS,
)


_STOPWORDS = {
    "the", "a", "an", "is", "are", "was", "were", "this", "that", "to", "of",
    "and", "or", "for", "in", "on", "at", "your", "you", "i", "we", "us",
    "it", "be", "will", "has", "have", "had", "with", "as", "by", "from",
    "our", "their", "not", "no", "do", "does", "did", "please", "hi", "hello",
}


def _tokenize(text: str) -> list[str]:
    tokens = re.findall(r"[a-z']+", text.lower())
    return [t for t in tokens if t not in _STOPWORDS]


def _bow_vector(tokens: list[str], vocab: dict[str, int]) -> np.ndarray:
    vec = np.zeros(len(vocab))
    counts = Counter(tokens)
    for word, idx in vocab.items():
        vec[idx] = counts.get(word, 0)
    return vec


def _cosine(a: np.ndarray, b: np.ndarray) -> float:
    denom = (np.linalg.norm(a) * np.linalg.norm(b))
    if denom == 0:
        return 0.0
    return float(np.dot(a, b) / denom)


# Build a shared vocabulary once at import time.
_ALL_DOCS = KNOWN_SCAM_SCRIPTS
_VOCAB: dict[str, int] = {}
for doc in _ALL_DOCS:
    for tok in _tokenize(doc):
        if tok not in _VOCAB:
            _VOCAB[tok] = len(_VOCAB)

_CORPUS_VECTORS = []


def _ensure_corpus_vectors():
    if not _CORPUS_VECTORS:
        for doc in _ALL_DOCS:
            toks = _tokenize(doc)
            for t in toks:
                _VOCAB.setdefault(t, len(_VOCAB))
        for doc in _ALL_DOCS:
            _CORPUS_VECTORS.append(_bow_vector(_tokenize(doc), _VOCAB))


def known_scam_similarity(transcript: str) -> float:
    """
    PRODUCTION UPGRADE: replace this bag-of-words cosine similarity with
    Sentence-Transformers embeddings + a FAISS index over a much larger,
    continuously refreshed corpus of known scam scripts.
    """
    _ensure_corpus_vectors()
    tokens = _tokenize(transcript)
    for t in tokens:
        _VOCAB.setdefault(t, len(_VOCAB))
    # Re-vectorize corpus if vocab grew.
    corpus_vecs = [_bow_vector(_tokenize(d), _VOCAB) for d in _ALL_DOCS]
    query_vec = _bow_vector(tokens, _VOCAB)
    if not corpus_vecs:
        return 0.0
    sims = [_cosine(query_vec, c) for c in corpus_vecs]
    return max(sims) if sims else 0.0


def _keyword_hits(transcript: str, keywords: list[str]) -> list[str]:
    lower = transcript.lower()
    hits = []
    for kw in keywords:
        # Word-boundary match for single words; substring match for phrases
        # (multi-word keywords can't rely on \b the same way and are rare
        # enough as substrings, e.g. "do not disconnect").
        if " " in kw:
            if kw in lower:
                hits.append(kw)
        else:
            if re.search(rf"\b{re.escape(kw)}\b", lower):
                hits.append(kw)
    return hits


def analyze_transcript(transcript: str, caller_claims_to_be: str | None = None) -> dict:
    """
    Returns a risk score (0-100), the risk band, matched pattern categories,
    similarity to the known-scam corpus, a recommendation, and a short
    natural-language explanation (the pieces an "Officer Copilot" or Claude
    call can later expand into a fuller narrative).
    """
    threat_hits = _keyword_hits(transcript, THREAT_KEYWORDS)
    urgency_hits = _keyword_hits(transcript, URGENCY_KEYWORDS)
    secrecy_hits = _keyword_hits(transcript, SECRECY_KEYWORDS)
    payment_hits = _keyword_hits(transcript, PAYMENT_KEYWORDS)

    similarity = known_scam_similarity(transcript)

    # Transparent, weighted rule-based score (easy to explain to judges/officers).
    score = 0.0
    score += min(len(threat_hits), 4) * 8       # up to 32
    score += min(len(urgency_hits), 3) * 7      # up to 21
    score += min(len(secrecy_hits), 2) * 10     # up to 20
    score += min(len(payment_hits), 3) * 6      # up to 18
    score += similarity * 40                    # up to 40 from similarity

    if caller_claims_to_be:
        govt_terms = ["cbi", "police", "customs", "income tax", "trai", "court", "cyber cell"]
        if any(term in caller_claims_to_be.lower() for term in govt_terms):
            score += 10

    score = max(0, min(100, round(score)))

    if score >= 75:
        band = "critical"
        recommendation = (
            "Do not transfer money or share OTP/Aadhaar details. This strongly "
            "matches known digital-arrest scam patterns. End the call and verify "
            "independently via the official helpline before taking any action."
        )
    elif score >= 50:
        band = "high"
        recommendation = (
            "Treat this call with suspicion. Do not act under pressure — verify "
            "the caller's identity through an official channel before sharing "
            "any information or making a payment."
        )
    elif score >= 25:
        band = "medium"
        recommendation = (
            "Some risk indicators present. Ask the caller to confirm details in "
            "writing through an official channel before proceeding."
        )
    else:
        band = "low"
        recommendation = "No strong scam indicators detected in this transcript."

    matched_patterns = []
    if threat_hits:
        matched_patterns.append(f"Threat/authority language: {', '.join(threat_hits)}")
    if urgency_hits:
        matched_patterns.append(f"Urgency pressure: {', '.join(urgency_hits)}")
    if secrecy_hits:
        matched_patterns.append(f"Secrecy/isolation request: {', '.join(secrecy_hits)}")
    if payment_hits:
        matched_patterns.append(f"Payment/OTP request: {', '.join(payment_hits)}")

    explanation = (
        f"Transcript matched known digital-arrest scam scripts with "
        f"{similarity * 100:.0f}% similarity, and contains "
        f"{len(threat_hits)} authority/threat terms, {len(urgency_hits)} urgency terms, "
        f"{len(secrecy_hits)} secrecy terms, and {len(payment_hits)} payment/OTP terms."
    )

    return {
        "risk_score": score,
        "risk_band": band,
        "matched_patterns": matched_patterns,
        "matched_known_scam_similarity": round(similarity, 3),
        "recommendation": recommendation,
        "explanation": explanation,
    }
