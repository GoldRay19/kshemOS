/**
 * SMS Analyzer – SMS & Message Scam Detection
 * 
 * Analyzes SMS messages for scam indicators using keyword matching,
 * pattern recognition, sender analysis, and urgency scoring.
 */

const SMS_SCAM_KEYWORDS = {
  financial: [
    'bank', 'account', 'debit', 'credit', 'card', 'transaction',
    'atm', 'pin', 'cvv', 'otp', 'password', 'netbanking',
    'wallet', 'balance', 'statement', 'payment',
  ],
  urgency: [
    'immediately', 'urgent', 'now', 'today', 'hurry', 'limited',
    'expires', 'expiring', 'last chance', 'final', 'warning',
    'blocked', 'suspended', 'frozen', 'terminated', 'restricted',
  ],
  gifts: [
    'won', 'winner', 'prize', 'lottery', 'cashback', 'reward',
    'gift', 'free', 'bonus', 'discount', 'offer', 'claim',
    'congratulations', 'selected', 'lucky',
  ],
  phishing: [
    'click', 'link', 'http', 'www', '.com', '.in', 'verify',
    'update', 'confirm', 'login', 'sign in', 'account',
    'aadhaar', 'pan', 'kyc', 'document', 'verification',
  ],
  personal: [
    'aadhaar', 'pan', 'voter', 'passport', 'ssn', 'tax',
    'income', 'salary', 'address', 'mother', 'father',
    'marital', 'employment', 'company',
  ],
  threats: [
    'legal', 'court', 'police', 'cbi', 'arrest', 'warrant',
    'notice', 'summons', 'fine', 'penalty', 'case', 'fir',
    'investigation', 'crime', 'illegal',
  ],
  money: [
    'send', 'transfer', 'payment', 'pay', 'deposit', 'withdraw',
    'loan', 'emi', 'interest', 'credit', 'cash', 'money',
    'rupees', 'rs', 'inr', 'dollars',
  ],
};

const KNOWN_SHORTCODES = {
  suspicious: [
    '567-', '765-', '921-', '922-', '900-', '901-',
  ],
  scam_numbers: [
    '+923', '+92', '+234', '+233', '+880', '+63',
    '+256', '+255', '+224', '+212',
  ],
};

const PHISHING_URL_PATTERNS = [
  /(?:tinyurl|bit\.ly|t\.co|rb\.gy|shorturl|is\.gd|ow\.ly|short\.link|cli\.gs|u\.to|short\.to|shorten\.link|tiny\.cc|qr\.ae|adf\.ly|shorte\.st|bc\.vc)\/[a-zA-Z0-9]+/gi,
  /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/[^\s]+/gi,
  /https?:\/\/[^\s]*\.(xyz|top|club|online|site|live|work|download|review|date|win|bid|trade|webcam|science|party|racing|gdn|loan|click|link|download|country|men|mom|rest|space|site|website|press|host|fun|store|cloud)/gi,
];

const BANK_SENDER_PATTERNS = [
  /^(?:ADB|SBI|HDFC|ICICI|AXIS|KOTAK|YESB|PNB|BOB|CAN|IDBI|INDUS|FED|RBL|CITI|HSBC|AMEX)/i,
  /^(?:PAYTM|PHONEPE|GOOGLE|AMZPAY|BHARATPE)/i,
];

const SCAM_SENDER_PATTERNS = [
  /^KYC/i, /^ALERT/i, /^SECURE/i, /^VERIFY/i, /^WINNER/i,
  /^PRIZE/i, /^REWARD/i, /^LOTTERY/i, /^CASHBACK/i, /^REFUND/i,
  /^URGENT/i, /^WARNING/i, /^BLOCKED/i, /^SUSPEND/i,
  /^FREE/i, /^OFFER/i, /^DEAL/i, /^TODAY/i, /^LIMITED/i,
];

function normalize(text) {
  return (text || '').toLowerCase().trim();
}

function extractURLs(text) {
  const urlRegex = /https?:\/\/[^\s]+/gi;
  return (text || '').match(urlRegex) || [];
}

function extractPhoneNumbers(text) {
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  return (text || '').match(phoneRegex) || [];
}

function extractAmounts(text) {
  const amountPatterns = [
    /(?:rs\.?|inr\.?|₹)\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)/gi,
    /\b(\d{4,7})\b(?:.*(?:rupees|rs|inr))/gi,
  ];
  const amounts = [];
  for (const pattern of amountPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      amounts.push(match[1] || match[0]);
    }
  }
  return [...new Set(amounts)];
}

export function analyzeSMS(sender, message, timestamp) {
  const text = normalize(message);
  const signals = [];
  let score = 0;

  // 1. Sender analysis
  if (sender) {
    const senderNorm = normalize(sender);
    
    // Check for international numbers (often used in scams)
    for (const prefix of KNOWN_SHORTCODES.scam_numbers) {
      if (senderNorm.startsWith(prefix)) {
        score += 30;
        signals.push({ type: 'international_sender', detail: `Sender is from a high-risk international number`, severity: 'high' });
      }
    }

    // Check if sender matches scam patterns
    const matchesScamSender = SCAM_SENDER_PATTERNS.some((p) => p.test(sender));
    if (matchesScamSender) {
      score += 25;
      signals.push({ type: 'suspicious_sender_name', detail: `Sender name "${sender}" matches known scam sender patterns`, severity: 'high' });
    }
  }

  // 2. Suspicious URL detection
  const urls = extractURLs(message);
  for (const url of urls) {
    for (const pattern of PHISHING_URL_PATTERNS) {
      if (pattern.test(url)) {
        score += 35;
        signals.push({ type: 'phishing_url', detail: `Message contains a phishing/shortened URL: ${url}`, severity: 'critical' });
      }
    }
    if (url.length > 50) {
      score += 10;
      signals.push({ type: 'long_url', detail: 'Contains an unusually long URL', severity: 'medium' });
    }
  }
  if (urls.length === 0 && text.includes('click') || text.includes('visit')) {
    score += 10;
    signals.push({ type: 'missing_url', detail: 'Message asks to click but no URL found — potential in-person or follow-up scam', severity: 'medium' });
  }

  // 3. Keyword scoring by category
  let keywordBreakdown = {};
  for (const [category, keywords] of Object.entries(SMS_SCAM_KEYWORDS)) {
    const hits = keywords.filter((kw) => text.includes(kw));
    if (hits.length > 0) {
      keywordBreakdown[category] = hits;
      const categoryScore = Math.min(30, hits.length * 6);
      score += categoryScore;
      signals.push({ type: `scam_keyword_${category}`, detail: `Detected ${category} scam keywords: ${hits.slice(0, 4).join(', ')}`, severity: hits.length >= 3 ? 'high' : 'medium' });
    }
  }

  // 4. Urgency + Financial combo (high risk)
  if (keywordBreakdown.urgency && keywordBreakdown.financial) {
    score += 20;
    signals.push({ type: 'urgency_financial_combo', detail: 'Message combines financial keywords with urgency — classic scam pattern', severity: 'critical' });
  }

  // 5. Personal info request
  if (keywordBreakdown.personal) {
    score += 25;
    signals.push({ type: 'personal_info_request', detail: 'Message requests personal/Aadhaar/PAN information', severity: 'critical' });
  }

  // 6. Legal threats
  if (keywordBreakdown.threats) {
    score += 30;
    signals.push({ type: 'legal_threat', detail: 'Message contains legal threat language — authority impersonation scam', severity: 'critical' });
  }

  // 7. Gifts/Prizes
  if (keywordBreakdown.gifts) {
    score += 20;
    signals.push({ type: 'prize_scam', detail: 'Message promises gifts/prizes — advance-fee scam pattern', severity: 'high' });
  }

  // 8. Money transfer request
  if (keywordBreakdown.money) {
    score += 25;
    signals.push({ type: 'money_request', detail: 'Message asks for money transfer/payment', severity: 'high' });
  }

  // 9. Specific UPI/payment request
  if (/upi|paytm|phonepe|gpay|google\s*pay|amazon\s*pay/i.test(text)) {
    score += 15;
    signals.push({ type: 'upi_payment', detail: 'Message asks for UPI/payment app transaction', severity: 'high' });
  }

  // 10. Known scam phrases
  const scamPhrases = [
    'your account will be', 'your aadhaar is', 'your pan is',
    'kyc update', 'kyc expired', 'kyc failed', 'document pending',
    'verify your', 'confirm your', 'update your', 'activate your',
    'deactivate your', 'suspend your', 'block your', 'freeze your',
    'digital arrest', 'parcel seized', 'courier held',
    'income tax notice', 'tax refund', 'insurance claim',
    'mobile recharge', 'free recharge', 'lottery winner',
  ];
  const matchedPhrases = scamPhrases.filter((phrase) => text.includes(phrase));
  if (matchedPhrases.length > 0) {
    score += matchedPhrases.length * 8;
    signals.push({ type: 'known_scam_phrases', detail: `Contains known scam phrases: ${matchedPhrases.slice(0, 4).join(', ')}`, severity: 'critical' });
  }

  // 11. All caps / excitement (common in scam SMS)
  const upperRatio = (message || '').split('').filter((c) => c >= 'A' && c <= 'Z').length / Math.max((message || '').length, 1);
  if (upperRatio > 0.6 && (message || '').length > 20) {
    score += 10;
    signals.push({ type: 'all_caps', detail: 'Message is mostly uppercase — urgency trick', severity: 'medium' });
  }

  // 12. Multiple special characters
  const specialCount = (message || '').match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g)?.length || 0;
  if (specialCount > 5) {
    score += 5;
    signals.push({ type: 'excessive_special_chars', detail: 'Message contains excessive special characters', severity: 'low' });
  }

  const finalScore = Math.min(100, score);
  let riskBand = 'low';
  let recommendation = 'This message appears to be legitimate.';
  if (finalScore >= 65) {
    riskBand = 'critical';
    recommendation = 'DO NOT respond to this message or click any links. Report as spam/phishing immediately.';
  } else if (finalScore >= 40) {
    riskBand = 'high';
    recommendation = 'This message is suspicious. Do not click links or share personal information.';
  } else if (finalScore >= 18) {
    riskBand = 'medium';
    recommendation = 'Some scam indicators detected. Stay cautious.';
  }

  return {
    risk_score: finalScore,
    risk_band: riskBand,
    recommendation,
    signals: signals.slice(0, 12),
    details: {
      sender,
      length: message?.length || 0,
      urls_found: urls.length,
      phone_numbers: extractPhoneNumbers(message),
      amounts_found: extractAmounts(message),
      keyword_breakdown: keywordBreakdown,
    },
    breakdown: {
      sender_risk: sender ? (score > 0 ? 25 : 0) : 0,
      url_risk: urls.length > 0 ? 35 : 0,
      keyword_risk: Object.keys(keywordBreakdown).length * 10,
      urgency_financial: (keywordBreakdown.urgency && keywordBreakdown.financial) ? 20 : 0,
      legal_threat: keywordBreakdown.threats ? 30 : 0,
    },
  };
}

export function batchAnalyzeSMS(messages) {
  return messages.map((msg) => ({
    ...msg,
    analysis: analyzeSMS(msg.sender, msg.message, msg.timestamp),
  }));
}

