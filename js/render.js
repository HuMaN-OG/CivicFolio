/* Safe, single-column resume renderer shared by preview and print. */
function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}
function safeHref(value) {
  const raw=String(value||"").trim();
  if (!raw) return "";
  try {
    const parsed=new URL(raw);
    return (parsed.protocol==="https:" || parsed.protocol==="http:") ? parsed.href : "";
  } catch(e) { return ""; }
}
function resumeParagraph(text) { return '<p class="doc-text">'+escapeHtml(text)+'</p>'; }
function resumeBullets(value) {
  const lines=String(value||"").split(/\n/).map(s=>s.replace(/^[\s•●\-]+/,"").trim()).filter(Boolean);
  if(!lines.length)return "";
  return '<ul class="doc-bullet">'+lines.map(x=>'<li>'+escapeHtml(x)+'</li>').join("")+'</ul>';
}
function renderResumeDocument(data,style) {
  const r=data||{},p=r.profile||{};
  const sections=[];
  function section(title,body) {
    if(body && body.trim()) sections.push('<section class="doc-section"><h2>'+title+'</h2>'+body+'</section>');
  }
  const contacts=[];
  if(p.location)contacts.push(escapeHtml(p.location));
  if(p.email && /^[^\s@]+@[^\s@]+$/.test(p.email))contacts.push('<a href="mailto:'+encodeURIComponent(p.email).replace(/%40/g,"@")+'">'+escapeHtml(p.email)+'</a>');
  if(p.phone)contacts.push(escapeHtml(p.phone));
  [["LinkedIn",p.linkedin],["GitHub",p.github],["Portfolio",p.website]].forEach(([label,url])=>{
    const safe=safeHref(url);
    if(safe)contacts.push('<a href="'+escapeHtml(safe)+'" target="_blank" rel="noopener noreferrer">'+label+'</a>');
  });
  const header='<div class="resume-top"><h1>'+escapeHtml(p.fullName||"Your name")+'</h1>'
    +(p.headline?'<p class="resume-headline">'+escapeHtml(p.headline)+'</p>':"")
    +'<div class="resume-contact">'+contacts.join(" · ")+'</div></div>';
  if(p.summary)section("Professional Summary",resumeParagraph(p.summary));
  const sk=r.skills||{}, skillLines=[];
  [["Languages","languages"],["Frameworks & APIs","frameworks"],["Databases","databases"],["Tools & Platforms","tools"]]
    .forEach(([label,key])=>{
      const v=Array.isArray(sk[key])?sk[key].join(", "):String(sk[key]||"");
      if(v.trim())skillLines.push('<div class="doc-text"><strong>'+label+':</strong> '+escapeHtml(v)+'</div>');
    });
  section("Skills",skillLines.join(""));
  const experience=(r.experience||[]).map(x=>{
    if(!x.title&&!x.company&&!x.bullets)return "";
    return '<div class="doc-item"><div class="doc-item-title"><span>'+escapeHtml(x.title||"")
      +(x.company?' — '+escapeHtml(x.company):"")+'</span><span>'+escapeHtml(x.dates||"")+'</span></div>'+resumeBullets(x.bullets)+'</div>';
  }).join("");
  section("Experience",experience);
  const projects=(r.projects||[]).map(x=>{
    if(!x.title&&!x.bullets)return "";
    const url=safeHref(x.url), linked=url?'<a href="'+escapeHtml(url)+'" target="_blank" rel="noopener noreferrer">Project ↗</a>':"";
    return '<div class="doc-item"><div class="doc-item-title"><span>'+escapeHtml(x.title||"")
      +(x.dates?' <span class="doc-sub">| '+escapeHtml(x.dates)+'</span>':"")+'</span>'+linked+'</div>'
      +(x.tech?'<div class="doc-sub">'+escapeHtml(x.tech)+'</div>':"")+resumeBullets(x.bullets)+'</div>';
  }).join("");
  section("Projects",projects);
  const education=(r.education||[]).map(x=>{
    if(!x.institution&&!x.degree)return "";
    return '<div class="doc-item"><div class="doc-item-title"><span>'+escapeHtml(x.institution||"")+'</span><span>'+escapeHtml(x.dates||"")+'</span></div>'
      +(x.degree?'<div class="doc-sub">'+escapeHtml(x.degree)+'</div>':"")
      +(x.details?resumeParagraph(x.details):"")+'</div>';
  }).join("");
  section("Education",education);
  const certifications=(r.certifications||[]).map(x=>{
    if(!x.name)return "";
    const info=[x.issuer,x.date].filter(Boolean).join(" · ");
    return '<div class="doc-item"><strong>'+escapeHtml(x.name)+'</strong>'
      +(info?' <span class="doc-sub">— '+escapeHtml(info)+'</span>':"")+'</div>';
  }).join("");
  section("Certifications",certifications);
  const pubs=(r.publications||[]).map(x=>{
    if(!x.title)return "";
    const url=safeHref(x.url), link=url?' <a href="'+escapeHtml(url)+'" target="_blank" rel="noopener noreferrer">Read publication</a>':"";
    return '<div class="doc-item"><strong>'+escapeHtml(x.title)+'</strong>'
      +(x.venue?'<div class="doc-sub">'+escapeHtml(x.venue)+'</div>':"")
      +(x.doi?'<div class="doc-sub">DOI: '+escapeHtml(x.doi)+link+'</div>':link)+'</div>';
  }).join("");
  section("Publications",pubs);
  return '<article class="resume-document '+(style==="classic"?"doc-classic":"doc-modern")+'" aria-label="Resume document">'+header+sections.join("")+'</article>';
}
if(typeof module!=="undefined"&&module.exports)module.exports={escapeHtml,safeHref,resumeBullets,renderResumeDocument};
