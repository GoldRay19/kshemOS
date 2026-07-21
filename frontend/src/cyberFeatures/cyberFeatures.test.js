import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeJobOffer } from './jobScamRadar.js';
import { analyzePasswordStrength } from './passStrengthPro.js';

test('flags fake job offers with urgent payment language', () => {
  const result = analyzeJobOffer({
    company: 'QuickHire',
    salary: '₹5000/day',
    message: 'Pay a registration fee today to start work and receive your salary quickly.'
  });

  assert.equal(result.risk_band, 'critical');
  assert.ok(result.risk_score >= 70);
});

test('scores weak passwords as high risk', () => {
  const result = analyzePasswordStrength('Password123');

  assert.equal(result.risk_band, 'high');
  assert.ok(result.risk_score >= 40);
});
