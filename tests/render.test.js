const test=require("node:test");
const assert=require("node:assert/strict");
const {renderResumeDocument,escapeHtml,safeHref}=require("../js/render");
const {defaultResumeData}=require("../js/data");

test("document contains the standard resume sections, never NIC-only headings",()=>{
  const html=renderResumeDocument(defaultResumeData,"modern");
  assert.ok(html.includes(">Experience<"));
  assert.ok(html.includes(">Projects<"));
  assert.ok(html.includes(">Education<"));
  assert.ok(html.includes(">Skills<"));
  assert.ok(!html.includes("Selected Projects"));
  assert.ok(!html.includes("NIC Winter Internship"));
});
test("HTML injection and dangerous links are blocked",()=>{
  const r=structuredClone(defaultResumeData);
  r.profile.fullName='<img src=x onerror=alert(1)>';
  r.profile.website="javascript:alert(1)";
  r.projects[0].url="javascript:alert(2)";
  r.projects[0].bullets="<script>alert(1)</script>";
  const html=renderResumeDocument(r);
  assert.ok(html.includes("&lt;img"));
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(!html.includes('href="javascript:'));
  assert.equal(safeHref("javascript:alert(1)"),"");
  assert.equal(escapeHtml('A&B'),"A&amp;B");
});
test("user-entered ordinary https link remains clickable",()=>{
  const r=structuredClone(defaultResumeData);
  r.profile.github="https://github.com/HuMaN-OG";
  const html=renderResumeDocument(r,"classic");
  assert.ok(html.includes('href="https://github.com/HuMaN-OG"'));
  assert.ok(html.includes("doc-classic"));
});
