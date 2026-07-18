"""
Thin wrapper around the Anthropic API for the Citizen Assistant and Officer
Copilot agents. If ANTHROPIC_API_KEY is not set, falls back to a canned
template response so the rest of the demo still runs end-to-end without a key.
"""
from __future__ import annotations

import os

_client = None


def _get_client():
    global _client
    if _client is None:
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            return None
        import anthropic
        _client = anthropic.Anthropic(api_key=api_key)
    return _client


def ask_claude(system_prompt: str, user_prompt: str, max_tokens: int = 500) -> str:
    client = _get_client()
    if client is None:
        return (
            "[Claude API key not configured — set ANTHROPIC_API_KEY to enable live "
            "multilingual responses, FIR drafting, and case summaries. Showing a "
            "placeholder response for demo purposes.]\n\n"
            f"Placeholder answer for: {user_prompt[:200]}"
        )
    response = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=max_tokens,
        system=system_prompt,
        messages=[{"role": "user", "content": user_prompt}],
    )
    parts = [block.text for block in response.content if block.type == "text"]
    return "\n".join(parts).strip()
