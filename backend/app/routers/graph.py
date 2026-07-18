from fastapi import APIRouter

from app.models import RingLookupResponse
from app.services.fraud_graph import get_ring_info

router = APIRouter(prefix="/api/graph", tags=["Fraud Graph Agent"])


@router.get("/ring/{account_id}", response_model=RingLookupResponse)
def ring_lookup(account_id: str):
    return get_ring_info(account_id)
