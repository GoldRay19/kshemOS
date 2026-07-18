from fastapi import APIRouter

from app.models import ScamAnalyzeRequest, ScamAnalyzeResponse
from app.services.scam_detection import analyze_transcript

router = APIRouter(prefix="/api/scam", tags=["Digital Arrest Agent"])


@router.post("/analyze", response_model=ScamAnalyzeResponse)
def analyze(payload: ScamAnalyzeRequest):
    result = analyze_transcript(payload.transcript, payload.caller_claims_to_be)
    return result
