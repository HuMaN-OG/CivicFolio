// CivicFolio Truthful Skill Matcher & Form Validator

function extractKeywords(text) {
  if (!text) return [];
  const tokens = text.toLowerCase().match(/\b[a-z0-9+#.-]{2,}\b/g) || [];
  const stopWords = new Set([
    'and', 'the', 'for', 'with', 'from', 'this', 'that', 'have', 'were',
    'will', 'your', 'about', 'looking', 'seeking', 'strong', 'skills', 'responsibilities'
  ]);
  return Array.from(new Set(tokens.filter(t => !stopWords.has(t))));
}

function matchKeywords(resumeSkills, jobText) {
  const jobTokens = extractKeywords(jobText);
  if (jobTokens.length === 0) {
    return { score: 0, matched: [], missing: [], totalJobKeywords: 0 };
  }

  const flattenedSkills = [];
  Object.entries(resumeSkills).forEach(([cat, list]) => {
    flattenedSkills.push(cat.toLowerCase());
    if (cat.endsWith('s')) flattenedSkills.push(cat.slice(0, -1).toLowerCase());
    if (Array.isArray(list)) {
      list.forEach(s => flattenedSkills.push(s.toLowerCase()));
    }
  });

  const matched = [];
  const missing = [];

  jobTokens.forEach(token => {
    const isFound = flattenedSkills.some(skill => skill.includes(token) || token.includes(skill));
    if (isFound) {
      matched.push(token);
    } else {
      missing.push(token);
    }
  });

  const percentage = Math.round((matched.length / jobTokens.length) * 100);
  return {
    percentage,
    matchedCount: matched.length,
    missingCount: missing.length,
    matched,
    missing: missing.slice(0, 10),
    totalJobKeywords: jobTokens.length
  };
}

function validateResume(data) {
  const errors = [];
  if (!data.profile || !data.profile.fullName.trim()) {
    errors.push("Full Name is required.");
  }
  if (!data.profile || !data.profile.email.trim()) {
    errors.push("Email is required.");
  }
  if (!data.education || data.education.length === 0) {
    errors.push("At least one education record is required.");
  }
  if (!data.projects || data.projects.length === 0) {
    errors.push("At least one project entry is required.");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { extractKeywords, matchKeywords, validateResume };
}
