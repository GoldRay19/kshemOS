from fastapi import APIRouter, UploadFile, File

from app.models import CurrencyScanResponse
from app.services.currency_scan import analyze_currency_image

router = APIRouter(prefix="/api/currency", tags=["Counterfeit Currency Agent"])


@router.post("/scan", response_model=CurrencyScanResponse)
async def scan(image: UploadFile = File(...)):
    image_bytes = await image.read()
    result = analyze_currency_image(image_bytes)
    return result
