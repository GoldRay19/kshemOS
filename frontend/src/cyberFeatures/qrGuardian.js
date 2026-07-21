/**
 * QR Guardian – QR Payment Fraud Detection
 * 
 * Analyzes QR code metadata, UPI IDs, merchant names, and amounts
 * to detect fraudulent QR payment requests using rule-based heuristics.
 */

const SUSPICIOUS_UPI_PATTERNS = [
  /pay\s*@?\d+/i,
  /merchant\d+/i,
  /random\w*@/i,
  /temp\d*@/i,
  /test\d*@/i,
  /scam\w*@/i,
  /fraud\w*@/i,
  /unknown\w*@/i,
  /receiver\d+@/i,
  /paytm\s*merchant/i,
  /@paytm/i,
  /@upi\s*merchant/i,
];

const SUSPICIOUS_MERCHANT_NAMES = [
  'refund', 'cashback', 'prize', 'lottery', 'winner', 'free',
  'urgent', 'payment', 'recharge', 'mobile', 'wallet', 'kyc',
  'verify', 'verification', 'service fee', 'processing fee',
  'advance', 'security', 'deposit', 'fine', 'penalty',
];

const SUSPICIOUS_DOMAINS = [
  'bit.ly', 'tinyurl', 't.co', 'rb.gy', 'shorturl', 'short.link',
  'qr.ae', 'shorte.st', 'adf.ly', 'cutt.ly', 'ow.ly', 'is.gd',
];

const SAFE_BANKS = [
  'sbi', 'hdfc', 'icici', 'axis', 'kotak', 'yes bank', 'pnb',
  'bob', 'canara', 'union', 'idbi', 'indusind', 'federal',
  'rbl', 'dbs', 'standard chartered', 'citi',
];

const MERCHANT_PAYMENT_APPS = [
  'paytm', 'phonepe', 'gpay', 'google pay', 'amazon pay',
  'bharatpe', 'mobikwik', 'freecharge',
];

function normalize(text) {
  return (text || '').toLowerCase().trim();
}

function containsAny(text, keywords) {
  const n = normalize(text);
  return keywords.some((kw) => n.includes(kw.toLowerCase()));
}

function extractUPIId(text) {
  const match = (text || '').match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

function extractAmount(text) {
  const match = (text || '').match(/(?:rs\.?|inr\.?|₹)\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)/i);
  if (match) return parseFloat(match[1].replace(/,/g, ''));
  const numMatch = (text || '').match(/\b(\d{2,6}(?:\.\d{1,2})?)\b/);
  if (numMatch) return parseFloat(numMatch[1]);
  return 0;
}

function extractQRText(data) {
  // Parse common QR code formats (UPI, BharatQR, etc.)
  const upiId = extractUPIId(data);
  const amount = extractAmount(data);
  
  // Try to extract merchant name from UPI string
  let merchantName = '';
  const paMatch = data.match(/pa[\.:]?([^&]+)/i);
  if (paMatch) merchantName = paMatch[1].trim();
  const pnMatch = data.match(/pn[\.:]?([^&]+)/i);
  if (pnMatch && !merchantName) merchantName = pnMatch[1].trim();

  return { upiId, amount, merchantName };
}

export function scanQRCode(data) {
  const parsed = extractQRText(data);
  const text = normalize(data);
  const signals = [];

  // 1. UPI ID analysis
  let upiRiskScore = 0;
  if (parsed.upiId) {
    for (const pattern of SUSPICIOUS_UPI_PATTERNS) {
      if (pattern.test(parsed.upiId)) {
        upiRiskScore += 25;
        signals.push({ type: 'suspicious_upi', detail: `UPI ID "${parsed.upiId}" matches suspicious pattern`, severity: 'high' });
      }
    }
    // Check if UPI ID is from a payment app (merchant) vs bank
    const isMerchantApp = MERCHANT_PAYMENT_APPS.some((app) => parsed.upiId.includes(app));
    if (isMerchantApp) {
      upiRiskScore += 10;
      signals.push({ type: 'merchant_app', detail: 'UPI ID is from a payment app, not a personal bank account', severity: 'low' });
    }
  } else {
    upiRiskScore += 15;
    signals.push({ type: 'no_upi', detail: 'No UPI ID found in QR data', severity: 'medium' });
  }

  // 2. Merchant name analysis
  let merchantRiskScore = 0;
  if (parsed.merchantName) {
    const isSuspicious = SUSPICIOUS_MERCHANT_NAMES.some((name) =>
      normalize(parsed.merchantName).includes(name)
    );
    if (isSuspicious) {
      merchantRiskScore += 30;
      signals.push({ type: 'suspicious_merchant', detail: `Merchant name "${parsed.merchantName}" contains suspicious keywords`, severity: 'high' });
    }
    // Check for brand impersonation
    const brandNames = ['amazon', 'flipkart', 'google', 'microsoft', 'reliance', 'tata', 'myntra'];
    const impersonatesBrand = brandNames.some((brand) => normalize(parsed.merchantName).includes(brand));
    if (impersonatesBrand) {
      merchantRiskScore += 35;
      signals.push({ type: 'brand_impersonation', detail: `Merchant name "${parsed.merchantName}" impersonates a known brand`, severity: 'critical' });
    }
  } else {
    merchantRiskScore += 10;
    signals.push({ type: 'no_merchant', detail: 'No merchant name found', severity: 'low' });
  }

  // 3. Amount analysis
  let amountRiskScore = 0;
  if (parsed.amount > 0) {
    if (parsed.amount >= 10000) {
      amountRiskScore += 15;
      signals.push({ type: 'high_amount', detail: `High amount: ₹${parsed.amount}`, severity: 'medium' });
    }
    if (parsed.amount === 0) {
      amountRiskScore += 20;
      signals.push({ type: 'zero_amount', detail: 'Zero amount set in QR — potential phishing', severity: 'high' });
    }
  }

  // 4. URL/Domain analysis
  let domainRiskScore = 0;
  const urls = data.match(/https?:\/\/[^\s&]+/gi) || [];
  for (const url of urls) {
    const hasSuspiciousDomain = SUSPICIOUS_DOMAINS.some((domain) => url.includes(domain));
    if (hasSuspiciousDomain) {
      domainRiskScore += 35;
      signals.push({ type: 'suspicious_domain', detail: `URL "${url}" uses a link shortener service`, severity: 'critical' });
    }
    // Check for IP address URLs (common in phishing)
    if (/https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)) {
      domainRiskScore += 40;
      signals.push({ type: 'ip_address_url', detail: 'QR points to an IP address URL instead of a domain', severity: 'critical' });
    }
    // Check for misspelled domains
    const misspelled = ['g00gle', 'amaz0n', 'flipkart', 'payt m', 'ph nepe', 'goggle'];
    if (misspelled.some((m) => url.includes(m))) {
      domainRiskScore += 45;
      signals.push({ type: 'typosquatting', detail: 'QR URL may be a typosquatting/misspelled domain', severity: 'critical' });
    }
  }

  // 5. Amount + UPI + Merchant combo heuristics
  if (parsed.amount > 0 && parsed.upiId && !parsed.merchantName) {
    signals.push({ type: 'anonymous_payment', detail: 'Payment request with amount but no merchant identification', severity: 'medium' });
  }

  if (parsed.amount > 5000 && containsAny(text, ['urgent', 'pay now', 'immediately', 'today only', 'last chance'])) {
    signals.push({ type: 'urgent_payment', detail: 'High amount with urgency language', severity: 'high' });
  }

  if (containsAny(text, ['refund', 'cashback', 'prize', 'won', 'winner'])) {
    signals.push({ type: 'refund_prize', detail: 'QR claims refund/prize/cashback — classic scam pattern', severity: 'high' });
  }

  // 6. Check for known fake payment screens
  if (containsAny(text, ['payment successful', 'payment received', 'transaction completed'])) {
    signals.push({ type: 'fake_payment_confirm', detail: 'QR contains fake payment confirmation language', severity: 'critical' });
  }

  // Calculate total score
  const totalScore = upiRiskScore + merchantRiskScore + amountRiskScore + domainRiskScore;
  const finalScore = Math.min(100, totalScore);

  // Risk band determination
  let riskBand = 'low';
  let recommendation = 'This QR code appears safe. Standard precautions apply.';
  if (finalScore >= 70) {
    riskBand = 'critical';
    recommendation = 'DO NOT scan this QR code. It shows multiple fraud indicators including suspicious UPI ID, impersonation, or malicious URLs.';
  } else if (finalScore >= 45) {
    riskBand = 'high';
    recommendation = 'This QR code is suspicious. Verify the merchant/person before scanning. Check the UPI ID carefully.';
  } else if (finalScore >= 20) {
    riskBand = 'medium';
    recommendation = 'Some minor risk signals detected. Verify the merchant identity before proceeding.';
  }

  return {
    risk_score: finalScore,
    risk_band: riskBand,
    recommendation,
    signals,
    details: {
      upi_id: parsed.upiId || null,
      merchant_name: parsed.merchantName || null,
      amount: parsed.amount || null,
      has_url: urls.length > 0,
      urls: urls.length > 0 ? urls : [],
    },
    breakdown: {
      upi_risk: upiRiskScore,
      merchant_risk: merchantRiskScore,
      amount_risk: amountRiskScore,
      domain_risk: domainRiskScore,
    },
  };
}

export function generateQRReport(data) {
  const result = scanQRCode(data);
  return {
    timestamp: new Date().toISOString(),
    scanned_data: data.substring(0, 100) + (data.length > 100 ? '...' : ''),
    ...result,
    safe_to_scan: result.risk_band === 'low',
  };
}

