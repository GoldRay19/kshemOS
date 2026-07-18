# KshemOS — AI Operating System for Digital Public Safety

A working hackathon prototype for **AI for Digital Public Safety: Defeating
Counterfeiting, Fraud & Digital Arrest Scams** — see
`KshemOS_Project_Blueprint.md` for the full vision, architecture, pitch
deck outline, and demo script. This folder is the actual buildable code.

## What's real vs. what's a stand-in

Everything below **runs end-to-end with zero paid services**, so the demo
works even with no API keys configured. Each stand-in is commented in the
code with a `PRODUCTION UPGRADE` note pointing at what a real deployment
would use instead:

| Agent | This prototype | Production upgrade |
|---|---|---|
| Digital Arrest Agent | Keyword + bag-of-words similarity scoring against a small synthetic scam-script corpus | Whisper for live audio → Sentence-Transformers + FAISS over a large, continuously-updated corpus |
| Counterfeit Currency Agent | Pillow/numpy image heuristics (edge density, texture, sharpness, resolution) | YOLOv11 note/region detector + OCR + reference feature-matching |
| Fraud Graph Agent | In-memory `networkx` graph, seeded with synthetic accounts | Neo4j + Graph Neural Network mule-probability model |
| Citizen Assistant / Officer Copilot | Claude API (falls back to a placeholder string if no key is set) | Same, at production scale with retrieval over full case data |

## Repository layout

```
rakshakos/
  backend/     FastAPI service — the 5 agents, one app, one process
  frontend/    React + Vite + Tailwind — Citizen Portal & Officer Command Center
```

## Run the backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate   # optional but recommended
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...   # optional — omit to use placeholder responses
uvicorn app.main:app --reload --port 8000
```

- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/

## Run the frontend

```bash
cd frontend
npm install
cp .env.example .env   # edit VITE_API_URL if your backend isn't on localhost:8000
npm run dev
```

Open the printed local URL. Use the **Citizen / Officer** toggle in the top
bar to switch portals. A few things to try in the demo:

1. **Citizen → Digital Arrest Agent**: the transcript box is pre-filled with
   a synthetic scam script — press "Check this call" to see the risk gauge
   animate up to a critical score, then edit the text to something benign
   (e.g. "calling to confirm your loan appointment") and re-run it to see
   the score drop.
2. **Citizen → Counterfeit Currency Agent**: upload any photo — sharp,
   well-lit, high-resolution photos score higher confidence; blurry/small
   images get flagged as suspicious/inconclusive.
3. **Citizen → Report form**: submit a report, note the returned `RPT-xxxx`
   ID.
4. **Officer → Fraud Graph Agent**: try the sample account chips
   (`ACC-1002`, `ACC-1009` are seeded as likely mule accounts, linked to
   flagged accounts `ACC-1001` / `ACC-1008`).
5. **Officer → Officer Copilot**: paste the `RPT-xxxx` ID from step 3
   (optionally with a linked account ID) to generate an AI case summary.

## Known limitations 

- The scam-detection corpus and fraud-graph data are small and
  **synthetic** — written for this prototype, not scraped from real cases.
- The counterfeit-currency heuristic checks image quality/texture
  signals, not real security-thread/microprint/watermark verification —
  it is scaffolding for a trained YOLO pipeline, not a replacement for one.
- The Citizen Assistant/Officer Copilot need `ANTHROPIC_API_KEY` set to
  produce live multilingual/FIR-drafting output; otherwise they return a
  clearly-labelled placeholder so the rest of the flow still works.
- No authentication/RBAC is wired up yet — see the blueprint's Security
  section for the intended approach.
