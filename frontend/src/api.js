const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function handle(res) {
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || JSON.stringify(body);
    } catch (_) {
      /* ignore */
    }
    throw new Error(detail);
  }
  return res.json();
}

export async function analyzeScamTranscript({ transcript, callerClaimsToBe, callerNumber }) {
  const res = await fetch(`${BASE_URL}/api/scam/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      transcript,
      caller_claims_to_be: callerClaimsToBe || null,
      caller_number: callerNumber || null,
    }),
  });
  return handle(res);
}

export async function scanCurrencyImage(file) {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`${BASE_URL}/api/currency/scan`, {
    method: 'POST',
    body: form,
  });
  return handle(res);
}

export async function lookupFraudRing(accountId) {
  const res = await fetch(`${BASE_URL}/api/graph/ring/${encodeURIComponent(accountId)}`);
  return handle(res);
}

export async function askCitizenAssistant({ question, language }) {
  const res = await fetch(`${BASE_URL}/api/citizen/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, language }),
  });
  return handle(res);
}

export async function submitCitizenReport(payload) {
  const res = await fetch(`${BASE_URL}/api/citizen/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function getCaseSummary(reportId, accountId) {
  const qs = accountId ? `?account_id=${encodeURIComponent(accountId)}` : '';
  const res = await fetch(`${BASE_URL}/api/officer/case/${encodeURIComponent(reportId)}${qs}`);
  return handle(res);
}
