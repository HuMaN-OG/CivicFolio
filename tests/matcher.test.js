const test = require('node:test');
const assert = require('node:assert/strict');
const { extractKeywords, matchKeywords, validateResume } = require('../js/matcher');
const { defaultResumeData, sampleJobDescriptions } = require('../js/data');

test('extractKeywords parses unique alphanumeric words and excludes stop words', () => {
  const text = "Python and JavaScript developer with SQL and Docker skills.";
  const keywords = extractKeywords(text);
  assert.ok(keywords.includes('python'));
  assert.ok(keywords.includes('javascript'));
  assert.ok(keywords.includes('sql'));
  assert.ok(keywords.includes('docker'));
  assert.ok(!keywords.includes('and'));
  assert.ok(!keywords.includes('with'));
});

test('matchKeywords calculates truthful skill matches against job descriptions', () => {
  const result = matchKeywords(defaultResumeData.skills, sampleJobDescriptions.egov.text);
  assert.ok(result.percentage > 0 && result.percentage <= 100);
  assert.ok(result.matched.includes('python'));
  assert.ok(result.matched.includes('database'));
});

test('validateResume identifies missing required fields', () => {
  const valid = validateResume(defaultResumeData);
  assert.equal(valid.isValid, true);
  assert.equal(valid.errors.length, 0);

  const invalid = validateResume({ profile: { fullName: "", email: "" }, education: [], projects: [] });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.length >= 3);
});
