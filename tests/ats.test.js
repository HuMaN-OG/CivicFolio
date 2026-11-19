const test=require("node:test");
const assert=require("node:assert/strict");
const {defaultResumeData,emptyResumeData,sampleJobDescriptions}=require("../js/data");
const {hasPhrase,extractRequirements,matchKeywords,validateResume,analyzeReadiness,resumeToText,compareResumes}=require("../js/matcher");

test("skill matching recognizes technical terms without dangerous substring collisions",()=>{
  assert.equal(hasPhrase("JavaScript and TypeScript","java"),false);
  assert.equal(hasPhrase("React, HTML","react"),true);
  assert.equal(hasPhrase("C++ developer","c++"),true);
  assert.equal(hasPhrase("SQL database","sql"),true);
  assert.equal(hasPhrase("expressive writing","express"),false);
});

test("sample descriptions extract real skills and do not claim matches for unknown terms",()=>{
  assert.ok(extractRequirements(sampleJobDescriptions.data.text).includes("power bi"));
  const result=matchKeywords("Python, SQL, Git","Python, SQL, Kubernetes, an imaginary platform called BananaCloud.");
  assert.equal(result.percentage,67);
  assert.deepEqual(result.matched,["python","sql"]);
  assert.deepEqual(result.missing,["kubernetes"]);
  assert.equal(result.totalJobKeywords,3);
});

test("resume match uses current resume content including projects and experience",()=>{
  const r=structuredClone(defaultResumeData);
  r.skills={languages:[],frameworks:[],databases:[],tools:[]};
  r.projects=[{title:"FastAPI Integration",tech:"FastAPI",bullets:"Built REST API with Python and MongoDB"}];
  const check=matchKeywords(resumeToText(r),"We need FastAPI, Python, MongoDB, SAP.");
  assert.deepEqual(check.missing,["sap"]);
  assert.equal(check.matchedCount,3);
});

test("resume validation checks contact and substantial body sections",()=>{
  assert.equal(validateResume(defaultResumeData).isValid,true);
  const x=validateResume(emptyResumeData);
  assert.equal(x.isValid,false);
  assert.ok(x.errors.some(m=>m.includes("name")));
  assert.ok(x.errors.some(m=>m.includes("email")));
});

test("readiness checklist and version comparison are deterministic",()=>{
  const result=analyzeReadiness(defaultResumeData);
  assert.equal(result.checks.length,8);
  assert.ok(result.completed>=5);
  const after=structuredClone(defaultResumeData);
  after.profile.headline="New position";
  const changed=compareResumes(defaultResumeData,after).filter(x=>x.changed);
  assert.deepEqual(changed.map(x=>x.section),["profile"]);
});

test("empty JD returns no fabricated percentage",()=>{
  const m=matchKeywords("Python developer"," ");
  assert.equal(m.totalJobKeywords,0);
  assert.equal(m.percentage,0);
});
