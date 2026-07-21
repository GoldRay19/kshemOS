/**
 * LinkShield – Fake Website / URL Inspector
 * 
 * Inspects URLs for phishing, typosquatting, malicious patterns,
 * suspicious TLDs, and known scam indicators using deterministic rules.
 */

const SUSPICIOUS_TLDS = [
  '.xyz', '.top', '.club', '.online', '.site', '.live', '.work',
  '.download', '.review', '.date', '.win', '.bid', '.trade',
  '.webcam', '.science', '.party', '.racing', '.gdn', '.loan',
  '.click', '.link', '.download', '.country', '.men', '.mom',
];

const BRAND_DOMAINS = {
  'google': ['google.com', 'gmail.com', 'youtube.com', 'drive.google.com'],
  'amazon': ['amazon.in', 'amazon.com', 'amazon.co.in', 'amazonpay.com'],
  'flipkart': ['flipkart.com', 'flipkart.in'],
  'paytm': ['paytm.com'],
  'phonepe': ['phonepe.com'],
  'gpay': ['pay.google.com'],
  'hdfc': ['hdfcbank.com', 'netbanking.hdfcbank.com'],
  'icici': ['icicibank.com'],
  'sbi': ['onlinesbi.sbi', 'sbi.co.in'],
  'microsoft': ['microsoft.com', 'office.com', 'live.com', 'outlook.com'],
  'facebook': ['facebook.com', 'fb.com', 'messenger.com'],
  'instagram': ['instagram.com'],
  'twitter': ['twitter.com', 'x.com'],
  'whatsapp': ['whatsapp.com'],
  'telegram': ['telegram.org'],
  'irctc': ['irctc.co.in'],
  'gov': ['gov.in', 'nic.in', 'india.gov.in'],
};

const BRAND_KEYWORDS = Object.keys(BRAND_DOMAINS);

const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'secure', 'account',
  'update', 'confirm', 'payment', 'banking', 'wallet', 'otp',
  'aadhaar', 'pan', 'kyc', 'password', 'reset', 'recovery',
  'authenticate', 'authorize', 'validate', 'unlock', 'restore',
  'alert', 'warning', 'fraud', 'claim', 'reward', 'prize',
  'free', 'offer', 'win', 'bonus', 'cashback', 'refund',
  'limited', 'exclusive', 'urgent', 'action_required',
];

const PHISHING_SUBDOMAINS = [
  'secure', 'login', 'account', 'verify', 'update', 'confirm',
  'banking', 'service', 'support', 'help', 'auth', 'ssl',
  'security', 'protection', 'alert', 'notification',
];

const KNOWN_MALICIOUS_PATTERNS = [
  /login[.-]?secure/i,
  /secure[.-]?login/i,
  /account[.-]?verify/i,
  /verify[.-]?account/i,
  /password[.-]?reset/i,
  /reset[.-]?password/i,
  /bank[.-]?login/i,
  /login[.-]?bank/i,
  /free[.-]?recharge/i,
  /claim[.-]?prize/i,
  /win[.-]?lottery/i,
  /google[.-]?login/i,
  /facebook[.-]?secure/i,
  /amazon[.-]?gift/i,
  /paytm[.-]?offer/i,
  /phonepe[.-]?cashback/i,
];

function normalizeURL(url) {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

function extractTLD(hostname) {
  const parts = hostname.split('.');
  return '.' + parts.slice(-2).join('.'); // giv
}

function levenshteinDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[b.length][a.length];
}

function detectTyposquatting(hostname) {
  const matches = [];
  for (const brand of BRAND_KEYWORDS) {
    const distance = levenshteinDistance(hostname.toLowerCase(), brand);
    if (distance > 0 && distance <= 3) {
      matches.push({ brand, distance, type: 'direct_typo' });
    }
    // Check if brand is in hostname
    if (hostname.toLowerCase().includes(brand)) {
      // Check if the actual domain matches
      const validDomains = BRAND_DOMAINS[brand];
      const isExactMatch = validDomains.some((d) => hostname.toLowerCase() === d || hostname.toLowerCase().endsWith('.' + d));
      if (!isExactMatch) {
        matches.push({ brand, distance: 1, type: 'brand_embedded_in_wrong_domain' });
      }
    }
  }
  return matches;
}

export function inspectURL(urlString) {
  const url = normalizeURL(urlString);
  if (!url) {
    return {
      risk_score: 100,
      risk_band: 'critical',
      is_valid: false,
      recommendation: 'This is not a valid URL. Do not visit it.',
      signals: [{ type: 'invalid_url', detail: 'String is not a valid URL', severity: 'critical' }],
      details: {},
    };
  }

  const hostname = url.hostname.toLowerCase();
  const tld = extractTLD(hostname);
  const signals = [];
  let score = 0;

  // 1. Check for IP address instead of domain
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
    score += 40;
    signals.push({ type: 'ip_address', detail: 'URL uses IP address instead of domain name', severity: 'critical' });
  }

  // 2. Suspicious TLD
  if (SUSPICIOUS_TLDS.some((st) => hostname.endsWith(st) || hostname.includes(st))) {
    score += 25;
    signals.push({ type: 'suspicious_tld', detail: `TLD "${tld}" is commonly used for phishing`, severity: 'high' });
  }

  // 3. Typosquatting detection
  const typoMatches = detectTyposquatting(hostname);
  if (typoMatches.length > 0) {
    for (const match of typoMatches) {
      score += 35;
      signals.push({
        type: 'typosquatting',
        detail: `URL appears to impersonate "${match.brand}" (typo distance: ${match.distance})`,
        severity: 'critical',
      });
    }
  }

  // 4. Suspicious keywords in URL path
  const path = (url.pathname + url.search).toLowerCase();
  const foundKeywords = SUSPICIOUS_KEYWORDS.filter((kw) => path.includes(kw));
  if (foundKeywords.length > 0) {
    score += Math.min(30, foundKeywords.length * 8);
    signals.push({
      type: 'suspicious_keywords',
      detail: `URL contains suspicious keywords: ${foundKeywords.slice(0, 4).join(', ')}`,
      severity: 'high',
    });
  }

  // 5. Suspicious subdomains
  const subdomain = hostname.split('.')[0];
  if (PHISHING_SUBDOMAINS.includes(subdomain) && hostname.split('.').length > 3) {
    score += 25;
    signals.push({
      type: 'suspicious_subdomain',
      detail: `Subdomain "${subdomain}" is commonly used in phishing attacks`,
      severity: 'high',
    });
  }

  // 6. Known malicious patterns
  for (const pattern of KNOWN_MALICIOUS_PATTERNS) {
    if (pattern.test(path) || pattern.test(hostname)) {
      score += 30;
      signals.push({
        type: 'known_phishing_pattern',
        detail: `URL matches known phishing pattern: ${pattern.source}`,
        severity: 'critical',
      });
    }
  }

  // 7. HTTPS check
  if (url.protocol !== 'https:') {
    score += 20;
    signals.push({ type: 'no_https', detail: 'URL does not use HTTPS', severity: 'high' });
  }

  // 8. Country code TLD + brand combo
  const ccTLD = hostname.match(/\.([a-z]{2})(?:\.([a-z]{2}))?$/);
  if (ccTLD && typoMatches.length > 0) {
    score += 15;
    signals.push({ type: 'brand_ccTLD', detail: 'Brand impersonation with country-code TLD', severity: 'high' });
  }

  // 9. Very long URL (phishing obfuscation)
  if (urlString.length > 200) {
    score += 10;
    signals.push({ type: 'long_url', detail: 'URL is unusually long, may be hiding malicious content', severity: 'medium' });
  }

  // 10. Special characters (subdomain spoofing)
  const suspiciousChars = /[@,\-]{3,}|_|%[0-9a-f]{2}/gi;
  const specialMatches = urlString.match(suspiciousChars);
  if (specialMatches && specialMatches.length > 5) {
    score += 15;
    signals.push({ type: 'encoded_chars', detail: 'URL contains excessive encoding/special characters', severity: 'medium' });
  }

  const finalScore = Math.min(100, score);
  let riskBand = 'low';
  let recommendation = 'This URL appears safe. Standard browsing precautions apply.';
  if (finalScore >= 65) {
    riskBand = 'critical';
    recommendation = 'DO NOT visit this URL. It shows strong phishing/typosquatting indicators.';
  } else if (finalScore >= 40) {
    riskBand = 'high';
    recommendation = 'This URL is highly suspicious. Verify the link before visiting.';
  } else if (finalScore >= 15) {
    riskBand = 'medium';
    recommendation = 'Some risk signals detected. Proceed with caution.';
  }

  return {
    risk_score: finalScore,
    risk_band: riskBand,
    is_valid: true,
    recommendation,
    signals: signals.slice(0, 10),
    details: {
      hostname,
      tld,
      protocol: url.protocol,
      path: url.pathname,
      has_https: url.protocol === 'https:',
      subdomains: hostname.split('.').slice(0, -2).join(','),
      url_length: urlString.length,
    },
    breakdown: {
      suspicious_tld: SUSPICIOUS_TLDS.some((st) => hostname.endsWith(st)) ? 25 : 0,
      typosquatting: typoMatches.length > 0 ? 35 : 0,
      ip_address: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) ? 40 : 0,
      suspicious_keywords: Math.min(30, foundKeywords.length * 8),
      no_https: url.protocol !== 'https:' ? 20 : 0,
    },
  };
}

export function batchInspectURLs(urls) {
  return urls.map((url) => ({
    url,
    result: inspectURL(url),
  }));
}

