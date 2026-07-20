- [ ] Inspect current scam detection rule engine (frontend) and frontend intelligence UI.

- [x] Implement additional scam analysis outputs in frontend ruleEngine.js (no backend changes):
  - [x] entity extraction (OTP/Aadhaar/bank/UPI/amounts/orgs/dates)
  - [x] evidence span extraction (matched phrases with context)
  - [ ] improved classification categories (scam_types + motive)
  - [x] timeline of tactics (ordered asks/threats/payments)
  - [x] detailed score breakdown (per-signal contributions + weights)
- [ ] (Removed) Backend schema updates not required because everything stays frontend rule-based.

- [x] Update frontend ScamIntelligencePage.jsx to render new sections (chips, evidence inspector, breakdown, timeline, entities) while preserving existing UI.
- [x] Run backend + frontend smoke checks (start servers, run analysis manually).



