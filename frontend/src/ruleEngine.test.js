import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeScamTranscript, askCitizenAssistantLocally } from './ruleEngine.js';

test('flags digital arrest language as critical', () => {
  const result = analyzeScamTranscript(
    'This is the CBI. You are under digital arrest and must transfer the verification amount now.',
    'CBI officer'
  );

  assert.equal(result.risk_band, 'critical');
  assert.ok(result.risk_score >= 75);
  assert.ok(result.matched_patterns.some((pattern) => pattern.includes('digital arrest')));
});

test('keeps benign language low-risk', () => {
  const result = analyzeScamTranscript(
    'I am calling to confirm your loan appointment for tomorrow afternoon.',
    'bank officer'
  );

  assert.equal(result.risk_band, 'low');
  assert.ok(result.risk_score < 25);
});

test('answers broader scam-style questions with a useful safety response', () => {
  const answer = askCitizenAssistantLocally(
    'I received a customs message asking for payment to release a parcel and avoid a court notice.',
    'English'
  );

  assert.match(answer, /customs|parcel|official|verify/i);
});
