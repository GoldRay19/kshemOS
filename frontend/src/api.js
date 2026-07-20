import emailjs from '@emailjs/browser';
import {
  analyzeScamTranscript as analyzeLocally,
  scanCurrencyImageLocally,
  askCitizenAssistantLocally,
  submitCitizenReportLocally,
  lookupFraudRingLocally,
  getCaseSummaryLocally,
  getRuleLibrarySamplesLocally,
} from './ruleEngine.js';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

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
  return analyzeLocally(transcript, callerClaimsToBe);
}

export async function scanCurrencyImage(file) {
  return scanCurrencyImageLocally(file);
}

export async function lookupFraudRing(accountId) {
  return lookupFraudRingLocally(accountId);
}

export async function askCitizenAssistant({ question, language }) {
  return { answer: askCitizenAssistantLocally(question, language) };
}

export async function submitCitizenReport(payload) {
  return submitCitizenReportLocally(payload);
}

export async function sendReportConfirmationEmail({ reportId, reporterName, recipientEmail, category, description, acknowledgement }) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    return {
      success: false,
      message: 'EmailJS configuration is missing. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY.',
    };
  }

  try {
    const templateParams = {
      report_id: reportId,
      reporter_name: reporterName,
      recipient_email: recipientEmail,
      report_category: category,
      report_description: description,
      acknowledgement,
    };

    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);

    return { success: true, message: 'Confirmation email sent successfully.' };
  } catch (error) {
    return {
      success: false,
      message: error?.text || error?.message || 'EmailJS failed to send confirmation.',
    };
  }
}

export async function getRuleLibrarySamples(limit) {
  return getRuleLibrarySamplesLocally(limit);
}

export async function getCaseSummary(reportId, accountId) {
  return getCaseSummaryLocally(reportId, accountId);
}
