from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

from app.services.local_llm import ask_local


class LLMRequest(BaseModel):
    prompt: str
    max_tokens: int = 512


class LLMResponse(BaseModel):
    text: str


router = APIRouter(prefix="/api/llm", tags=["LLM"])


@router.post("/chat", response_model=LLMResponse)
def chat(req: LLMRequest):
    """Simple chat endpoint that uses the first available LLM backend."""
    text = ask_local(req.prompt, req.max_tokens)
    return {"text": text}
