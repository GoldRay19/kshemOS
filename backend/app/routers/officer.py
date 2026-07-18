from fastapi import APIRouter, HTTPException

from app.models import CaseSummaryResponse
from app.services.claude_client import ask_claude
from app.services.fraud_graph import get_ring_info
from app.services.store import get_report

router = APIRouter(prefix="/api/officer", tags=["Officer Copilot Agent"])

SYSTEM_PROMPT = (
    "You are the KshemOS Officer Copilot, assisting Indian law-enforcement "
    "officers. Write concise, professional case summaries and concrete, "
    "actionable next investigative steps. Do not invent facts not present in "
    "the supplied data."
)


@router.get("/case/{report_id}", response_model=CaseSummaryResponse)
def case_summary(report_id: str, account_id: str | None = None):
    report = get_report(report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")

    graph_context = ""
    if account_id:
        ring_info = get_ring_info(account_id)
        graph_context = (
            f"\nLinked fraud-graph data for account {account_id}: "
            f"flagged={ring_info['is_flagged']}, "
            f"mule_probability={ring_info['mule_probability']}, "
            f"ring_id={ring_info['ring_id']}, "
            f"connected_accounts={ring_info['connected_accounts']}."
        )

    prompt = (
        f"Report category: {report['category']}\n"
        f"Reporter: {report['reporter_name']}\n"
        f"Description: {report['description']}"
        f"{graph_context}\n\n"
        "Write: (1) a 2-3 sentence case summary, (2) a priority of low/medium/"
        "high/critical with one reason, (3) three concrete next investigative "
        "steps as a bulleted list."
    )
    ai_output = ask_claude(SYSTEM_PROMPT, prompt, max_tokens=500)

    priority = "medium"
    lowered = ai_output.lower()
    for level in ("critical", "high", "medium", "low"):
        if level in lowered:
            priority = level
            break

    next_steps = [
        line.strip("-• ").strip()
        for line in ai_output.splitlines()
        if line.strip().startswith(("-", "•"))
    ] or ["Review linked fraud-graph accounts", "Contact reporter for evidence", "Escalate if priority is high/critical"]

    return {
        "case_id": report_id,
        "priority": priority,
        "summary": ai_output,
        "suggested_next_steps": next_steps[:3],
    }
