/**
 * PhishDetect – Email Phishing Analyzer
 * 
 * Analyzes email headers, body content, links, attachments,
 * and sender reputation using rule-based heuristics to detect
 * phishing attempts, spoofing, and social engineering.
 */

const PHISHING_SUBJECT_PATTERNS = [
  /urgent.*(?:action|update|verify|confirm)/i,
  /account.*(?:suspend|block|terminate|close|restrict)/i,
  /security.*(?:alert|notice|warning|update)/i,
  /password.*(?:expir|reset|change|update)/i,
  /payment.*(?:fail|decline|error|problem|need.*action)/i,
  /(?:unauthorized|suspicious).*(?:login|access|activity)/i,
  /confirm.*(?:registration|account|identity)/i,
  /verify.*(?:email|account|identity|information)/i,
  /(?:tax|income tax|itr).*(?:refund|notice|assessment)/i,
  /(?:invoice|bill|receipt).*(?:overdue|payment|due)/i,
  /(?:prize|lottery|winner|congratulations).*(?:won|selected)/i,
  /(?:job|offer|opportunity|position).*(?:urgent|immediate)/i,
  /(?:document|file).*(?:shared|uploaded|sent).*(?:secure)/i,
  /(?:re:|fw:|fwd:).*(?:urgent|important|payment|invoice)/i,
];

const SPOOFED_DISPLAY_NAMES = [
  'support', 'admin', 'security', 'helpdesk', 'noreply',
  'notification', 'alert', 'service', 'team', 'account',
  'administrator', 'info', 'contact', 'mailer', 'system',
  'it support', 'it helpdesk', 'google', 'microsoft', 'amazon',
  'paypal', 'netflix', 'facebook', 'instagram', 'twitter',
  'whatsapp', 'telegram', 'linkedin', 'github', 'apple',
];

const SUSPICIOUS_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'aol.com', 'mail.com', 'protonmail.com', 'tutanota.com',
  'zoho.com', 'yandex.com', 'mail.ru', 'rediffmail.com',
];

const SPAMMY_PHRASES = [
  'click here', 'click the link', 'click below', 'log in now',
  'sign in', 'verify now', 'confirm now', 'update now',
  'act now', 'act immediately', 'limited time', 'offer expires',
  'exclusive deal', 'free gift', 'claim your', 'you have won',
  'selected for', 'congratulations', 'you are a winner',
  'urgent action required', 'immediate action required',
  'account will be closed', 'account will be deleted',
  'failure to comply', 'failure to respond', 'ignore this message',
  'your account has been', 'suspicious activity detected',
  'unusual login attempt', 'someone tried to access',
  'security breach', 'data breach', 'information leak',
];

const ATTACHMENT_RISK_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.vbs', '.ps1', '.scr', '.jar',
  '.zip', '.rar', '.7z', '.docm', '.xlsm', '.pptm',
  '.js', '.wsf', '.msi', '.hta', '.vbe', '.jse',
];

function normalize(text) {
  return (text || '').toLowerCase().trim();
}

function extractSenderDomain(email) {
  const match = (email || '').match(/@([^\s>]+)/);
  return match ? match[1].toLowerCase() : null;
}

function extractLinks(body) {
  const links = [];
  const urlRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/gi;
  let match;
  while ((match = urlRegex.exec(body)) !== null) {
    links.push({ type: 'html', url: match[1] });
  }
  const textUrlRegex = /https?:\/\/[^\s<>"]+/gi;
  while ((match = textUrlRegex.exec(body)) !== null) {
    if (!links.some((l) => l.url === match[0])) {
      links.push({ type: 'text', url: match[0] });
    }
  }
  return links;
}

function analyzeDisplayNameSpoofing(fromName, fromEmail) {
  if (!fromName || !fromEmail) return [];
  const signals = [];
  const nameNorm = normalize(fromName);
  const domain = extractSenderDomain(fromEmail);

  // Check if display name impersonates a brand but email is from personal domain
  const isImpersonating = SPOOFED_DISPLAY_NAMES.some((name) => nameNorm.includes(name));
  if (isImpersonating && domain && SUSPICIOUS_EMAIL_DOMAINS.includes(domain)) {
    signals.push({ type: 'display_name_spoof', detail: `Display name "${fromName}" impersonates brand/service but email is from ${domain}`, severity: 'critical' });
  }

  // Check if email domain is different from what display name suggests
  const brandDomainMap = {
    'google': 'google.com', 'microsoft': 'microsoft.com', 'amazon': 'amazon.com',
    'paypal': 'paypal.com', 'netflix': 'netflix.com', 'facebook': 'facebook.com',
    'twitter': 'twitter.com', 'linkedin': 'linkedin.com', 'apple': 'apple.com',
    'instagram': 'instagram.com', 'whatsapp': 'whatsapp.com',
  };
  for (const [brand, legitDomain] of Object.entries(brandDomainMap)) {
    if (nameNorm.includes(brand) && domain && !domain.includes(legitDomain) && !domain.includes('.' + legitDomain)) {
      signals.push({ type: 'brand_spoof', detail: `Sender claims to be ${brand} but email is from ${domain}`, severity: 'critical' });
    }
  }

  return signals;
}

function analyzeHeaderAuthentication(headers) {
  const signals = [];
  if (!headers) return signals;

  // Check SPF, DKIM, DMARC
  const spfPass = /spf=pass/i.test(headers);
  const dkimPass = /dkim=pass/i.test(headers);
  const dmarcPass = /dmarc=pass/i.test(headers);

  if (!spfPass) signals.push({ type: 'spf_fail', detail: 'SPF authentication failed — email may be spoofed', severity: 'high' });
  if (!dkimPass) signals.push({ type: 'dkim_fail', detail: 'DKIM signature missing/failed — email integrity not verified', severity: 'high' });
  if (!dmarcPass) signals.push({ type: 'dmarc_fail', detail: 'DMARC policy failed — domain may be impersonated', severity: 'critical' });

  return signals;
}

function checkLinkConsistency(links, senderDomain) {
  const signals = [];
  if (!senderDomain || !links.length) return signals;

  for (const link of links) {
    try {
      const url = new URL(link.url);
      const linkDomain = url.hostname.toLowerCase();
      // Check if link domain is different from claimed sender
      if (!linkDomain.includes(senderDomain) && !linkDomain.includes('.' + senderDomain)) {
        // Check if it's a well-known domain
        const knownDomains = ['google.com', 'microsoft.com', 'outlook.com', 'office.com'];
        const isKnown = knownDomains.some((kd) => linkDomain.includes(kd));
        if (!isKnown) {
          signals.push({ type: 'mismatched_link', detail: `Link points to ${linkDomain} but sender is from ${senderDomain}`, severity: 'high' });
        }
      }
    } catch {
      // ignore invalid URLs
    }
  }
  return signals;
}

function checkLinkObfuscation(links) {
  const signals = [];
  for (const link of links) {
    try {
      const url = new URL(link.url);
      const decoded = decodeURIComponent(link.url);
      const suspiciousPatterns = [/@/, /%[0-9a-f]{2}/i, /redirect/i, /url=/i, /link=/i, /goto=/i, /forward/i];
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(decoded)) {
          signals.push({ type: 'obfuscated_link', detail: `Link uses obfuscation: ${link.url.substring(0, 60)}...`, severity: 'high' });
        }
      }
    } catch {
      // ignore invalid URLs
    }
  }
  return signals;
}

export function analyzeEmail(from, subject, body, headers) {
  const text = normalize(body || '');
  const signals = [];
  let score = 0;

  const fromName = from?.name || '';
  const fromEmail = from?.email || '';
  const domain = extractSenderDomain(fromEmail);

  // 1. Display name spoofing
  const spoofSignals = analyzeDisplayNameSpoofing(fromName, fromEmail);
  signals.push(...spoofSignals);
  if (spoofSignals.length > 0) score += 40;

  // 2. Header authentication
  const authSignals = analyzeHeaderAuthentication(headers);
  signals.push(...authSignals);
  if (authSignals.length > 0) score += 30;

  // 3. Subject analysis
  const subjectNorm = normalize(subject || '');
  const matchedSubjects = PHISHING_SUBJECT_PATTERNS.filter((p) => p.test(subjectNorm));
  if (matchedSubjects.length > 0) {
    score += Math.min(35, matchedSubjects.length * 10);
    signals.push({ type: 'suspicious_subject', detail: `Subject "${subject}" matches phishing patterns`, severity: 'high' });
  }

  // 4. Extract and analyze links
  const links = extractLinks(body || '');
  const linkConsistency = checkLinkConsistency(links, domain);
  signals.push(...linkConsistency);
  if (linkConsistency.length > 0) score += linkConsistency.length * 15;

  const obfuscatedLinks = checkLinkObfuscation(links);
  signals.push(...obfuscatedLinks);
  if (obfuscatedLinks.length > 0) score += 20;

  // 5. Spammy phrases
  const matchedPhrases = SPAMMY_PHRASES.filter((phrase) => text.includes(phrase));
  if (matchedPhrases.length > 0) {
    score += Math.min(30, matchedPhrases.length * 5);
    signals.push({ type: 'spammy_phrases', detail: `Contains ${matchedPhrases.length} known phishing phrases`, severity: 'medium' });
  }

  // 6. Attachment risk
  const bodyLower = (body || '').toLowerCase();
  const riskyAttachments = ATTACHMENT_RISK_EXTENSIONS.filter((ext) => bodyLower.includes(ext));
  if (riskyAttachments.length > 0) {
    score += 35;
    signals.push({ type: 'risky_attachment', detail: `Email references risky file type: ${riskyAttachments.join(', ')}`, severity: 'critical' });
  }

  // 7. HTML-only (no text) suspicious
  const hasHTML = /<html|<body|<div|<table|<a\s/i.test(body || '');
  const hasText = /[a-zA-Z]{3,}/.test(body?.replace(/<[^>]*>/g, '') || '');
  if (hasHTML && !hasText) {
    score += 15;
    signals.push({ type: 'html_only', detail: 'Email contains only HTML — possible zero-content phishing', severity: 'high' });
  }

  // 8. Urgency + personal info combo
  if (/urgent|immediately|asap|now|today/i.test(subjectNorm) && /account|password|ssn|aadhaar|pan|login|credit card/i.test(text)) {
    score += 25;
    signals.push({ type: 'urgent_info_request', detail: 'Urgent subject combined with request for personal/financial info', severity: 'critical' });
  }

  // 9. Mismatched reply-to
  const replyToMatch = (body || headers || '').match(/reply-to:\s*([^\s]+)/i);
  if (replyToMatch && domain) {
    const replyDomain = extractSenderDomain(replyToMatch[1]);
    if (replyDomain && replyDomain !== domain) {
      score += 20;
      signals.push({ type: 'reply_to_spoof', detail: `Reply-To (${replyDomain}) differs from sender (${domain})`, severity: 'high' });
    }
  }

  const finalScore = Math.min(100, score);
  let riskBand = 'low';
  let recommendation = 'This email appears legitimate.';
  if (finalScore >= 65) {
    riskBand = 'critical';
    recommendation = 'This is almost certainly a phishing email. Do not click any links or open attachments. Report immediately.';
  } else if (finalScore >= 40) {
    riskBand = 'high';
    recommendation = 'This email shows strong phishing indicators. Verify through a separate channel before acting.';
  } else if (finalScore >= 18) {
    riskBand = 'medium';
    recommendation = 'Some phishing indicators found. Exercise caution.';
  }

  return {
    risk_score: finalScore,
    risk_band: riskBand,
    recommendation,
    signals: signals.slice(0, 12),
    details: {
      from: fromEmail,
      display_name: fromName,
      domain,
      subject,
      links_found: links.length,
      suspicious_links: linkConsistency.length + obfuscatedLinks.length,
      matched_phrases: matchedPhrases.length,
      has_risky_attachments: riskyAttachments.length > 0,
    },
    link_analysis: links.slice(0, 8).map((l) => ({
      url: l.url.substring(0, 80),
      type: l.type,
    })),
    breakdown: {
      spoofing: spoofSignals.length > 0 ? 40 : 0,
      auth_fail: authSignals.length > 0 ? 30 : 0,
      subject_risk: matchedSubjects.length * 10,
      link_risk: linkConsistency.length * 15 + (obfuscatedLinks.length > 0 ? 20 : 0),
      attachment_risk: riskyAttachments.length > 0 ? 35 : 0,
      phrase_risk: matchedPhrases.length * 5,
    },
  };
}

export function analyzeEmailHeader(rawHeader) {
  // Parse essential headers from raw header string
  const headers = {};
  const lines = (rawHeader || '').split('\n');
  for (const line of lines) {
    const match = line.match(/^([^:]+):\s*(.+)$/);
    if (match) {
      headers[match[1].toLowerCase()] = match[2].trim();
    }
  }
  return {
    from: headers['from'] || '',
    reply_to: headers['reply-to'] || '',
    return_path: headers['return-path'] || '',
    spf: headers['received-spf'] || '',
    dkim: headers['dkim-signature'] ? 'present' : 'absent',
    dmarc: headers['dmarc'] || '',
    authentication: headers['authentication-results'] || '',
  };
}

