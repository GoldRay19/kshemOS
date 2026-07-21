/**
 * UPI Fraud Shield – UPI Transaction Risk Checker
 * 
 * Analyzes UPI transaction details (UPI ID, amount, merchant,
 * reason, timestamp) to detect fraudulent patterns using
 * rule-based scoring and heuristic analysis.
 */

const HIGH_RISK_UPI_PATTERNS = [
  /^(?!.*@(?:ok[a-z]+|paytm|ybl|ibl|axl|apl|upi|icici|hdfc|sbi|axis|kotak|yesbank|pnb|idbi|federal|indus|rbl)).*$/i,
  /^\d{10,}@/i,
  /^temp\d*@/i,
  /^test\d*@/i,
  /^user\d*@/i,
  /^guest\d*@/i,
  /^random\d*@/i,
  /^customer\d+@/i,
];

const SUSPICIOUS_REASONS = [
  'refund', 'cashback', 'prize', 'lottery', 'reward',
  'verification', 'processing fee', 'service fee', 'registration',
  'security deposit', 'advance', 'commission', 'membership',
  'subscription', 'activation', 'renewal', 'upgrade',
  'fine', 'penalty', 'late fee', 'charges',
  'loan processing', 'loan approval', 'loan disbursement',
  'exam fee', 'application fee', 'ticket booking',
  'shipping', 'delivery', 'customs', 'clearance',
];

const SUSPICIOUS_TIME_PATTERNS = [
  { start: 0, end: 6, label: 'late night (12 AM - 6 AM)', weight: 20 },
  { start: 22, end: 24, label: 'late evening (10 PM - 12 AM)', weight: 10 },
];

const KNOWN_SCAM_UPI = [
  'paytm@upi', 'phonepe@ybl', 'googlepay@upi',
];

const FREQUENCY_PATTERNS = {
  multiple_small: { count: 5, maxAmount: 500, windowMinutes: 60, label: 'multiple small transactions', weight: 25 },
  rapid_sequence: { count: 3, maxAmount: 10000, windowMinutes: 5, label: 'rapid sequence of transactions', weight: 35 },
};

function normalize(text) {
  return (text || '').toLowerCase().trim();
}

function parseUPIId(upiId) {
  if (!upiId) return null;
  const parts = upiId.split('@');
  return {
    username: parts[0],
    handle: parts[1] || 'unknown',
    full: upiId,
  };
}

function isBankHandle(handle) {
  const bankHandles = ['ybl', 'ibl', 'axl', 'apl', 'icici', 'hdfc', 'sbi', 'axis', 'kotak', 'yesbank', 'pnb', 'idbi', 'federal', 'indus', 'rbl', 'citi', 'dbs', 'union', 'bob', 'cbi', 'canara', 'iofb', 'ubi', 'mah', 'dnb', 'kbl', 'jkl', 'sib', 'kvb', 'dnb', 'csb', 'southindian', 'tmb', 'karnataka'];
  return bankHandles.includes(handle.toLowerCase());
}

function isAppHandle(handle) {
  const appHandles = ['paytm', 'okhdfcbank', 'oksbi', 'okicici', 'okaxis', 'okbobaxis', 'okpnb', 'okyesbank', 'airtel', 'jio', 'freecharge', 'mobikwik'];
  return appHandles.some((app) => handle.toLowerCase().includes(app));
}

function parseTimestamp(timestamp) {
  if (!timestamp) return new Date();
  const d = new Date(timestamp);
  return isNaN(d.getTime()) ? new Date() : d;
}

export function analyzeTransaction(upiId, amount, reason, timestamp, recentTransactions) {
  const signals = [];
  let score = 0;
  const parsed = parseUPIId(upiId);
  const reasonNorm = normalize(reason || '');
  const txnTime = parseTimestamp(timestamp);
  const hour = txnTime.getHours();

  // 1. UPI ID analysis
  if (!parsed) {
    score += 50;
    signals.push({ type: 'invalid_upi', detail: 'Invalid or missing UPI ID', severity: 'critical' });
  } else {
    // Check for suspicious UPI patterns
    for (const pattern of HIGH_RISK_UPI_PATTERNS) {
      if (pattern.test(parsed.full)) {
        score += 25;
        signals.push({ type: 'suspicious_upi_pattern', detail: `UPI ID "${parsed.full}" matches suspicious pattern`, severity: 'high' });
      }
    }

    // Check handle type
    if (isAppHandle(parsed.handle)) {
      // App-based handles can be legitimate but also used by fraudsters
      score += 8;
      signals.push({ type: 'app_handle', detail: `UPI handle "${parsed.handle}" is a payment app handle — verify merchant`, severity: 'low' });
    }

    // Check if handle is totally unknown
    if (!isBankHandle(parsed.handle) && !isAppHandle(parsed.handle) && parsed.handle !== 'upi') {
      score += 15;
      signals.push({ type: 'unknown_handle', detail: `UPI handle "${parsed.handle}" is not a known bank or app handle`, severity: 'medium' });
    }

    // Username with only digits
    if (/^\d{8,}$/.test(parsed.username)) {
      score += 15;
      signals.push({ type: 'numeric_upi', detail: 'UPI username is all digits — unusual for personal accounts', severity: 'medium' });
    }
  }

  // 2. Amount analysis
  const amountNum = parseFloat(amount) || 0;
  if (amountNum > 0) {
    if (amountNum >= 50000) {
      score += 20;
      signals.push({ type: 'high_value', detail: `High-value transaction: ₹${amountNum.toLocaleString('en-IN')}`, severity: 'high' });
    }
    if (amountNum >= 100000) {
      score += 15;
      signals.push({ type: 'very_high_value', detail: `Very high-value transaction: ₹${amountNum.toLocaleString('en-IN')}`, severity: 'critical' });
    }
    // Odd amounts often used by scammers for testing
    if (amountNum % 100 !== 0 && amountNum < 1000) {
      score += 8;
      signals.push({ type: 'odd_amount', detail: `Odd amount ₹${amountNum} — common in scam testing patterns`, severity: 'low' });
    }
  } else {
    score += 20;
    signals.push({ type: 'zero_amount', detail: 'Transaction amount is zero or invalid', severity: 'high' });
  }

  // 3. Reason/purpose analysis
  const matchedReasons = SUSPICIOUS_REASONS.filter((r) => reasonNorm.includes(r));
  if (matchedReasons.length > 0) {
    score += Math.min(35, matchedReasons.length * 10);
    signals.push({ type: 'suspicious_reason', detail: `Transaction purpose "${reason}" contains suspicious keywords`, severity: 'high' });
  }

  // 4. Time-based analysis
  for (const tp of SUSPICIOUS_TIME_PATTERNS) {
    if (hour >= tp.start && hour < tp.end) {
      score += tp.weight;
      signals.push({ type: 'suspicious_time', detail: `Transaction at ${tp.label} — unusual for legitimate payments`, severity: tp.weight >= 20 ? 'high' : 'medium' });
    }
  }

  // 5. Known scam UPI IDs
  if (parsed && KNOWN_SCAM_UPI.some((scam) => parsed.full.includes(scam))) {
    score += 50;
    signals.push({ type: 'known_scam_upi', detail: `UPI ID "${parsed.full}" is associated with known scams`, severity: 'critical' });
  }

  // 6. Recent transaction frequency analysis (if provided)
  if (recentTransactions && recentTransactions.length > 0) {
    const recentList = recentTransactions.map((t) => ({
      amount: parseFloat(t.amount) || 0,
      time: parseTimestamp(t.timestamp),
    }));

    // Check for rapid small transactions
    const smallTxns = recentList.filter((t) => t.amount <= 500);
    if (smallTxns.length >= 5) {
      score += 25;
      signals.push({ type: 'frequent_small_txns', detail: `${smallTxns.length} small transactions (≤₹500) detected — mule account pattern`, severity: 'high' });
    }

    // Check for rapid sequence
    const recentWithin5min = recentList.filter((t) => (txnTime - t.time) < 5 * 60 * 1000);
    if (recentWithin5min.length >= 3) {
      score += 30;
      signals.push({ type: 'rapid_transactions', detail: `${recentWithin5min.length} transactions within 5 minutes — rapid transfer pattern`, severity: 'critical' });
    }
  }

  // 7. Deposit-to-wallet pattern (common in layering)
  if (reasonNorm.includes('wallet') && amountNum > 10000) {
    score += 15;
    signals.push({ type: 'wallet_top_up', detail: 'Large wallet top-up — potential money mule layering', severity: 'high' });
  }

  const finalScore = Math.min(100, score);
  let riskBand = 'low';
  let recommendation = 'This transaction appears legitimate.';
  if (finalScore >= 65) {
    riskBand = 'critical';
    recommendation = 'This transaction is highly suspicious. Do not proceed without verifying the recipient through an official channel.';
  } else if (finalScore >= 40) {
    riskBand = 'high';
    recommendation = 'This transaction has strong fraud indicators. Verify the UPI ID and reason before sending money.';
  } else if (finalScore >= 18) {
    riskBand = 'medium';
    recommendation = 'Some risk indicators detected. Double-check the recipient UPI ID.';
  }

  return {
    risk_score: finalScore,
    risk_band: riskBand,
    recommendation,
    signals: signals.slice(0, 10),
    details: {
      upi_id: parsed ? parsed.full : upiId,
      upi_handle: parsed ? parsed.handle : 'unknown',
      handle_type: parsed ? (isBankHandle(parsed.handle) ? 'bank' : isAppHandle(parsed.handle) ? 'app' : 'unknown') : 'unknown',
      amount: amountNum,
      reason: reason || 'Not specified',
      timestamp: txnTime.toISOString(),
      hour_of_day: hour,
    },
    breakdown: {
      upi_risk: parsed && !isBankHandle(parsed.handle) ? 23 : 0,
      amount_risk: amountNum >= 50000 ? 35 : 0,
      reason_risk: matchedReasons.length * 10,
      time_risk: SUSPICIOUS_TIME_PATTERNS.some((tp) => hour >= tp.start && hour < tp.end) ? 20 : 0,
      frequency_risk: score > 30 ? 25 : 0,
    },
  };
}

export function analyzeUPIHistory(transactions) {
  if (!transactions || transactions.length === 0) {
    return { risk_score: 0, patterns: [], summary: 'No transaction history provided.' };
  }

  const patterns = [];
  let maxRisk = 0;

  // Analyze each transaction
  const analyzed = transactions.map((txn) => ({
    ...txn,
    analysis: analyzeTransaction(txn.upi_id, txn.amount, txn.reason, txn.timestamp, transactions.filter((t) => t !== txn)),
  }));

  maxRisk = Math.max(...analyzed.map((a) => a.analysis.risk_score));

  // Detect overall patterns
  const totalAmount = transactions.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  const avgAmount = totalAmount / transactions.length;

  if (avgAmount > 25000) {
    patterns.push('High average transaction value');
  }

  if (analyzed.filter((a) => a.analysis.risk_band === 'critical').length >= 2) {
    patterns.push('Multiple high-risk transactions detected');
  }

  const uniqueRecipients = new Set(transactions.map((t) => t.upi_id));
  if (uniqueRecipients.size === 1 && transactions.length > 3) {
    patterns.push('Multiple transactions to same recipient — verify relationship');
  }

  let riskBand = 'low';
  if (maxRisk >= 65) riskBand = 'critical';
  else if (maxRisk >= 40) riskBand = 'high';
  else if (maxRisk >= 18) riskBand = 'medium';

  return {
    risk_score: maxRisk,
    risk_band: riskBand,
    total_transactions: transactions.length,
    total_amount: totalAmount,
    average_amount: avgAmount,
    unique_recipients: uniqueRecipients.size,
    patterns,
    analyzed,
    summary: `Analyzed ${transactions.length} transactions. ${patterns.length ? 'Detected patterns: ' + patterns.join(', ') : 'No unusual patterns detected.'}`,
  };
}

