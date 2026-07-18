"""
Lightweight adapter that prefers an API key (OpenAI) and falls back to
an optional local `llama-cpp-python` model if configured.

This file is defensive: missing optional dependencies will not crash the
application — it returns a helpful placeholder message instead.
"""
from __future__ import annotations

import os
from typing import Optional


def ask_local(prompt: str, max_tokens: int = 512) -> str:
    """Return a text completion from the first available backend.

    Priority:
    1. OpenAI when `OPENAI_API_KEY` is set
    2. llama-cpp-python when `LOCAL_LLAMA_PATH` is set and importable
    3. Placeholder fallback when no backend is configured
    """
    # 1) OpenAI
    if os.environ.get("OPENAI_API_KEY"):
        try:
            import openai

            openai.api_key = os.environ["OPENAI_API_KEY"]
            model = os.environ.get("OPENAI_MODEL", "gpt-3.5-turbo")
            resp = openai.ChatCompletion.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
            )
            return resp["choices"][0]["message"]["content"].strip()
        except Exception as e:  # pragma: no cover - runtime environment dependent
            return f"[OpenAI call failed: {e}]"

    # 2) local llama-cpp-python
    try:
        from llama_cpp import Llama

        model_path = os.environ.get("LOCAL_LLAMA_PATH")
        if not model_path:
            return "[No local Llama model path configured (set LOCAL_LLAMA_PATH)]"
        llm = Llama(model_path=model_path)
        resp = llm.create(prompt=prompt, max_tokens=max_tokens)
        # llama-cpp-python returns text in different shapes depending on version
        if isinstance(resp, dict):
            # prefer `choices[0].text` or `text` top-level
            text = ""
            choices = resp.get("choices")
            if choices and isinstance(choices, list):
                text = choices[0].get("text", "")
            text = text or resp.get("text", "")
            return (text or "").strip()
        return str(resp).strip()
    except Exception as e:  # pragma: no cover - runtime environment dependent
        return f"[No LLM backend configured or failed: {e}]"
