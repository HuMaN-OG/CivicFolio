/* Transparent, dictionary-based ATS-style checks. Not an ATS vendor score or hiring probability. */
const SKILL_ALIASES = {
  "python":["python"],"javascript":["javascript","java script"],"typescript":["typescript"],
  "java":["java"],"c++":["c++"],"c#":["c#"],"sql":["sql"],
  "html":["html","html5"],"css":["css","css3"],
  "react":["react","react.js","reactjs"],"angular":["angular"],"vue":["vue.js","vuejs"],
  "node.js":["node.js","nodejs","node js"],"express":["express","express.js"],
  "fastapi":["fastapi"],"flask":["flask"],"django":["django"],
  "rest apis":["rest api","restful api","rest apis","rest services","restful services"],
  "graphql":["graphql"],"microservices":["microservices","microservice"],
  "authentication":["authentication","jwt","oauth"],"authorization":["authorization","rbac","role based access","role-based access"],
  "security":["security","secure coding","cybersecurity"],
  "testing":["testing","unit tests","unit testing","integration testing","pytest","jest","automated tests"],
  "git":["git","github","gitlab"],"ci/cd":["ci/cd","ci cd","continuous integration","continuous delivery","github actions"],
  "docker":["docker","containerization"],"kubernetes":["kubernetes","k8s"],
  "linux":["linux"],"aws":["aws","amazon web services"],"azure":["azure","microsoft azure"],
  "gcp":["gcp","google cloud platform"],
  "database":["database","databases","dbms","database management","data integrity"],
  "mongodb":["mongodb","mongo db"],"postgresql":["postgresql","postgres"],"sqlite":["sqlite"],"mysql":["mysql"],
  "excel":["excel","microsoft excel","spreadsheets"],"power bi":["power bi","powerbi"],
  "tableau":["tableau"],"sap":["sap","erp"],"power automate":["power automate"],"power apps":["power apps"],
  "data analysis":["data analysis","data analytics","analyze data","analyse data"],
  "data visualization":["data visualization","data visualisation","charts"],
  "dashboards":["dashboard","dashboards"],"statistics":["statistics","statistical analysis"],
  "a/b testing":["a/b testing","ab testing","experimentation"],
  "etl":["etl","data pipeline","data pipelines"],"pandas":["pandas"],"numpy":["numpy"],
  "machine learning":["machine learning","ml models"],"scikit-learn":["scikit-learn","sklearn"],
  "deep learning":["deep learning"],"pytorch":["pytorch"],"tensorflow":["tensorflow"],
  "computer vision":["computer vision"],"nlp":["nlp","natural language processing"],
  "llms":["llm","llms","large language models"],"model evaluation":["model evaluation","model validation"],
  "feature engineering":["feature engineering"],"prompt engineering":["prompt engineering"],
  "data structures":["data structures","algorithms","dsa"],
  "object-oriented programming":["object oriented programming","object-oriented programming","oop"],
  "agile":["agile","scrum"],"release management":["release management","release planning"],
  "deployment":["deployment","deploying applications","software rollout","rollout plan"],
  "change management":["change management","organizational change management","ocm"],
  "user training":["user training","training delivery","train the trainer","training material"],
  "documentation":["technical documentation","documentation","user guides","process flows","quick reference guides"],
  "stakeholder management":["stakeholder management","stakeholders","stakeholder communication"],
  "troubleshooting":["troubleshooting","debugging","incident resolution","user support"],
  "communication":["communication","presentations","written communication"],
  "leadership":["leadership","team leadership"],"collaboration":["collaboration","teamwork","cross functional"],
  "product management":["product management","product strategy"],"user research":["user research","ux research"],
  "api integration":["api integration","system integration","integrating apis"],
  "reporting":["reporting","reports"],"accessibility":["accessibility","a11y","wcag"]
};
const STOP_WORDS = new Set(["and","the","for","with","from","this","that","have","were","will","your","about","looking","seeking","strong","skills","responsibilities","experience","using","work","team","build","role","job","ability","must","should","you","our","their","some","good","are","who","need"]);
function escapeRegex(value) { return value.replace(/[.*+?^$()|[\]{}\\]/g, "\\$&"); }
function hasPhrase(text, phrase) {
  const haystack = String(text || "").toLowerCase().replace(/[‐‑–—]/g, "-");
  const needle = String(phrase || "").toLowerCase().trim();
  if (!needle) return false;
  return new RegExp("(^|[^a-z0-9])" + escapeRegex(needle).replace(/\s+/g, "\\s+") + "(?=$|[^a-z0-9])", "i").test(haystack);
}
function extractKeywords(text) {
  const words = String(text || "").toLowerCase().match(/[a-z][a-z0-9+#.-]*/g) || [];
  return Array.from(new Set(words.filter(x=>x.length >= 2 && !STOP_WORDS.has(x))));
}
function extractRequirements(text) {
  return Object.entries(SKILL_ALIASES).filter(([,aliases])=>aliases.some(alias=>hasPhrase(text,alias))).map(([key])=>key);
}
function flattenSkills(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.join(" ");
  if (value && typeof value === "object") return Object.values(value).map(flattenSkills).join(" ");
  return "";
}
function matchKeywords(resumeTextOrSkills, jobText) {
  const target = extractRequirements(jobText);
  const resumeText = flattenSkills(resumeTextOrSkills);
  const matched = target.filter(key=>SKILL_ALIASES[key].some(alias=>hasPhrase(resumeText,alias)));
  const missing = target.filter(key=>!matched.includes(key));
  const percentage = target.length ? Math.round(100*matched.length/target.length) : 0;
  return {percentage,score:percentage,matched,missing,matchedCount:matched.length,
    missingCount:missing.length,totalJobKeywords:target.length,recognizedRequirements:target};
}
function resumeToText(resume) {
  const r=resume||{},p=r.profile||{};
  return [p.fullName,p.headline,p.email,p.phone,p.location,p.summary,p.github,p.linkedin,
    flattenSkills(r.skills),
    ...(r.education||[]).map(x=>[x.institution,x.degree,x.dates,x.details,x.cgpa].join(" ")),
    ...(r.experience||[]).map(x=>[x.title,x.company,x.dates,x.bullets].join(" ")),
    ...(r.projects||[]).map(x=>[x.title,x.tech,x.dates,x.bullets].join(" ")),
    ...(r.certifications||[]).map(x=>[x.name,x.issuer,x.date].join(" ")),
    ...(r.publications||[]).map(x=>[x.title,x.venue,x.doi].join(" "))].join("\n");
}
function validateResume(data) {
  const r=data||{},p=r.profile||{},errors=[];
  if (!String(p.fullName||"").trim()) errors.push("Add your full name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(p.email||"").trim())) errors.push("Enter a valid email address.");
  if (!Array.isArray(r.education)||!r.education.length) errors.push("Add at least one education entry.");
  if (!(r.projects||[]).length && !(r.experience||[]).length) errors.push("Add at least one project or experience entry.");
  return {isValid:!errors.length,errors};
}
function analyzeReadiness(resume, overrideText) {
  const p=resume.profile||{},text=overrideText||resumeToText(resume);
  const words=(text.match(/\b[\w#+.-]+\b/g)||[]).length;
  const checks=[
    {label:"Name and valid email",pass:!!p.fullName && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email||"")},
    {label:"Specific professional headline",pass:(p.headline||"").trim().length>=8},
    {label:"Professional summary",pass:(p.summary||"").trim().length>=50},
    {label:"Relevant skills",pass:extractRequirements(flattenSkills(resume.skills)).length>=3},
    {label:"Education",pass:(resume.education||[]).length>0},
    {label:"Projects or work experience",pass:(resume.projects||[]).length+(resume.experience||[]).length>0},
    {label:"Quantified impact where factual",pass:/\b\d+(?:[.,]\d+)?\s*(?:%|percent|hours?|users?|projects?|tests?|days?|weeks?|months?|x\b)/i.test(text)},
    {label:"Concise one-page target",pass:words<=680}
  ];
  return {checks,completed:checks.filter(c=>c.pass).length,total:checks.length,wordCount:words,
    suggestions:checks.filter(c=>!c.pass).map(c=>c.label),caution:"Heuristic checklist, not a hiring probability or official ATS score."};
}
function compareResumes(a,b) {
  return ["profile","skills","education","experience","projects","certifications","publications"]
    .map(section=>({section,changed:JSON.stringify((a||{})[section]||null)!==JSON.stringify((b||{})[section]||null)}));
}
if(typeof module!=="undefined"&&module.exports){
  module.exports={SKILL_ALIASES,extractKeywords,extractRequirements,hasPhrase,matchKeywords,resumeToText,
    flattenSkills,validateResume,analyzeReadiness,compareResumes};
}
