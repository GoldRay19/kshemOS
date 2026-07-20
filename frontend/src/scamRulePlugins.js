// Additional rule-based plugins for scam analysis.
// Keep everything deterministic + regex/rule based (no backend/ML).

export function runPlugins(text) {
  const raw = text || '';
  const lowered = raw.toLowerCase();

  const hasAny = (arr) => arr.some((p) => lowered.includes(p));

  // 1) Device / SIM / phone compromise signals
  const deviceSignals = {
    device_compromise: /phone is compromised|phone compromised|sim will be blocked|your sim will be blocked|your phone is compromised|mobile will be suspended|device compromised|account will be blocked/i.test(raw),
    sim_blocking: /sim will be blocked|sim is blocked|sim card|your sim/i.test(raw),
    suspension: /suspended|blocked|will be blocked|will be suspended/i.test(raw),
  };

  // 2) Call recording / monitoring signals
  const monitoringSignals = {
    recording: /call is being recorded|this call is being recorded/i.test(raw),
    monitoring: /you are being monitored|being monitored|surveillance|under surveillance/i.test(raw),
    verification_call: /official verification|verification/i.test(raw),
  };

  // 3) Link manipulation / QR / shortlink style (common in scams)
  const interactionSignals = {
    qr_or_shortlink: /qr\s*code|upi\s*qr|short link|tinyurl|bit\.ly|t\.co|download\s+the\s+app/i.test(raw),
    whatsapp_push: /whatsapp|whatsapp message/i.test(raw),
    sms_push: /sms|text message/i.test(raw),
    app_install: /install|install the app|update|software update/i.test(raw),
  };

  // 4) Identity & KYC extraction pressure
  const identitySignals = {
    kyc: /kyc|know\s+your\s+customer/i.test(raw),
    identity_verification: /verify your identity|verify identity|identity is under review|account under review/i.test(raw),
    personal_data: /aadhar|aadhaar|pan\b|passport\b|address|mother's name|father's name/i.test(raw),
  };

  // 5) Delivery & parcel scam indicators
  const deliverySignals = {
    parcel: /parcel|courier|delivery|shipment|consignment|tracking number|tracking id/i.test(raw),
    seized_parcel: /parcel.*seized|seized.*parcel|release the parcel/i.test(raw),
  };

  // 6) Gift cards / prepaid / crypto indicators
  const paymentAltSignals = {
    gift_cards: /gift card|amazon gift card|voucher|prepaid card/i.test(raw),
    crypto: /crypto|bitcoin|ethereum|usdt|usdc/i.test(raw),
    cash_out: /cash app|mobile recharge|recharge/i.test(raw),
  };

  // 7) Typo/urgency / pressure escalation phrases
  const languagePressureSignals = {
    threat_pressure: hasAny([
      'do not disconnect',
      'do not hang up',
      'no time to waste',
      'last chance',
      'final warning',
      'immediate action',
      'urgent compliance',
    ]),
    deadline_pressure: hasAny(['within', 'today itself', 'before the deadline', 'in two hours', 'in 10 minutes']),
  };

  // 8) Evidence preservation requests
  const evidenceRequests = {
    asks_to_send_screenshot: /send screenshot|screenshot|image of.*|share screenshot|upload/i.test(raw),
    asks_to_share_otp: /share your otp|send otp|otp/i.test(raw),
  };

  // 9) Police/legal procedural phrasing without real details
  const legalVibeSignals = {
    legal_phrases: hasAny(['fir', 'fir has been opened', 'court summons', 'bail order', 'warrant will be issued', 'legal notice', 'investigation officer']),
    threat_without_details: /warrant will be issued|arrest warrant|court order|under digital arrest/i.test(raw),
  };

  // 10) Scam category suggestion (multi-signal)
  const categories = [];
  if (deliverySignals.parcel) categories.push('courier/parcel scam');
  if (deviceSignals.sim_blocking || deviceSignals.device_compromise) categories.push('SIM/phone compromise scam');
  if (identitySignals.kyc || /aadhaar.*otp|otp.*aadhaar/i.test(raw)) categories.push('KYC/identity verification scam');
  if (deliverySignals.seized_parcel) categories.push('release parcel scam');
  if (legalVibeSignals.legal_phrases) categories.push('legal threat / authority impersonation');
  if (paymentAltSignals.gift_cards) categories.push('gift card / prepaid scam');
  if (paymentAltSignals.crypto) categories.push('crypto scam');
  if (paymentAltSignals.cash_out) categories.push('cash-out / mobile recharge scam');

  // De-dupe
  const cats = [...new Set(categories)];

  return {
    deviceSignals,
    monitoringSignals,
    interactionSignals,
    identitySignals,
    deliverySignals,
    paymentAltSignals,
    languagePressureSignals,
    evidenceRequests,
    legalVibeSignals,
    pluginCategories: cats,
  };
}

