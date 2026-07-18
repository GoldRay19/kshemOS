"""
Counterfeit Currency Agent.

Hackathon-real implementation: lightweight image heuristics (edge density,
texture uniformity, resolution/sharpness, colour-channel variance) computed
with Pillow + numpy — chosen so the service runs anywhere with zero model
downloads. It is explicitly a stand-in for a trained YOLOv11 note-detector +
OpenCV security-feature pipeline; see PRODUCTION UPGRADE notes.

The verdict is intentionally conservative: this heuristic detects "does this
image look like a clean, well-lit, high-detail photo of a note with expected
texture/edge complexity", not real security-thread/microprint/watermark
verification. It's honest scaffolding to plug a trained model into.
"""
from __future__ import annotations

import io

import numpy as np
from PIL import Image, ImageFilter


def _edge_density(gray: np.ndarray) -> float:
    # Simple Sobel-like gradient magnitude via numpy diff (no OpenCV needed).
    gx = np.diff(gray.astype(np.float32), axis=1)
    gy = np.diff(gray.astype(np.float32), axis=0)
    gx = gx[:-1, :]
    gy = gy[:, :-1]
    magnitude = np.sqrt(gx**2 + gy**2)
    threshold = magnitude.mean() + magnitude.std()
    edge_pixels = (magnitude > threshold).sum()
    return float(edge_pixels / magnitude.size)


def _texture_uniformity(gray: np.ndarray) -> float:
    # Local variance as a texture-richness proxy; genuine notes have fine,
    # irregular print texture rather than large flat/uniform regions.
    std = gray.astype(np.float32).std()
    return float(std)


def _sharpness(image: Image.Image) -> float:
    edges = image.convert("L").filter(ImageFilter.FIND_EDGES)
    arr = np.asarray(edges, dtype=np.float32)
    return float(arr.var())


def analyze_currency_image(image_bytes: bytes) -> dict:
    """
    PRODUCTION UPGRADE: replace this heuristic bundle with a YOLOv11 model
    fine-tuned to localize note region + security thread + watermark area +
    serial number, followed by OCR (serial) and per-region texture/feature
    matching against a genuine-note reference bank, as described in the
    architecture document's Counterfeit Currency Module.
    """
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception:
        return {
            "verdict": "inconclusive",
            "confidence": 0.0,
            "reasons": ["Could not read image data — please upload a clear JPEG/PNG photo."],
            "signals": {},
        }

    width, height = image.size
    gray = np.asarray(image.convert("L"))

    edge_density = _edge_density(gray)
    texture = _texture_uniformity(gray)
    sharpness = _sharpness(image)
    resolution_score = min(1.0, (width * height) / (1200 * 600))  # normalize vs a decent photo

    reasons = []
    signal_score = 0.0
    weight_total = 0.0

    # Resolution / capture quality
    weight_total += 1
    if resolution_score >= 0.5:
        signal_score += 1
    else:
        reasons.append("Image resolution is low — retake photo in better light and closer focus.")

    # Edge density (fine print detail expected on genuine notes)
    weight_total += 1
    if edge_density >= 0.08:
        signal_score += 1
    else:
        reasons.append("Low fine-detail edge density detected — may indicate a low-quality print or photocopy.")

    # Texture richness
    weight_total += 1
    if texture >= 30:
        signal_score += 1
    else:
        reasons.append("Texture appears unusually flat/uniform for a genuine note's print pattern.")

    # Sharpness (blurry copies often smear fine security features)
    weight_total += 1
    if sharpness >= 800:
        signal_score += 1
    else:
        reasons.append("Image is soft/blurry — fine security features (microprint, thread) cannot be verified.")

    confidence = round(signal_score / weight_total, 2)

    if confidence >= 0.75:
        verdict = "likely_genuine"
        if not reasons:
            reasons.append("Image quality and texture/edge signals are consistent with a genuine note photo.")
    elif confidence >= 0.4:
        verdict = "inconclusive"
        reasons.append("Some signals are borderline — retake the photo in better lighting for a clearer verdict.")
    else:
        verdict = "suspicious"
        reasons.append(
            "Multiple signals below expected thresholds for a genuine note. "
            "Do not accept this note without further verification."
        )

    signals = {
        "width": width,
        "height": height,
        "edge_density": round(edge_density, 4),
        "texture_std": round(texture, 2),
        "sharpness_variance": round(sharpness, 2),
        "resolution_score": round(resolution_score, 2),
    }

    return {
        "verdict": verdict,
        "confidence": confidence,
        "reasons": reasons,
        "signals": signals,
    }
