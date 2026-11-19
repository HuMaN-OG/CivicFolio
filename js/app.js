/* CivicFolio application. No server, login or secret credential required. */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  const STORE_KEY="civicfolio-workspace-v2";
  const $=id=>document.getElementById(id);
  const clone=x=>JSON.parse(JSON.stringify(x));
  const headings={overview:"Overview",editor:"Resume builder",checker:"ATS-style checker",versions:"Version history",export:"Export centre"};
  const sections=["profile","skills","experience","projects","education","certifications","publications"];
  const listLabels={
    experience:"Experience",projects:"Project",education:"Education",
    certifications:"Certification",publications:"Publication"
  };
  const listFields={
    experience:[["title","Job title"],["company","Company / organization"],["dates","Dates"],["bullets","Achievements (one bullet per line)","textarea"]],
    projects:[["title","Project name"],["tech","Technologies"],["dates","Dates"],["url","Project link","url"],["bullets","Contributions and results (one per line)","textarea"]],
    education:[["institution","Institution"],["degree","Degree / qualification"],["dates","Dates"],["details","CGPA, grades or relevant coursework","textarea"]],
    certifications:[["name","Certification / course"],["issuer","Issuer"],["date","Completion year"]],
    publications:[["title","Publication title"],["venue","Conference / journal"],["doi","DOI"],["url","Publication link","url"]]
  };
  function normalizeResume(r) {
    const src=r&&typeof r==="object"?r:{};
    const base=clone(emptyResumeData);
    base.profile=Object.assign(base.profile,src.profile||{});
    for(const key of Object.keys(base.skills))base.skills[key]=Array.isArray((src.skills||{})[key]) ? src.skills[key] : [];
    ["experience","projects","education","certifications","publications"].forEach(key=>{
      base[key]=Array.isArray(src[key])?src[key].slice(0,50).filter(x=>x&&typeof x==="object"):[];
    });
    return base;
  }
  function newState(sample) {
    return {resume:normalizeResume(sample?defaultResumeData:emptyResumeData),
      sample:!!sample,jobPreset:"software",jobDescription:sampleJobDescriptions.software.text,customKeywords:"",
      jobTitle:"",template:"modern",versions:[]};
  }
  let state=newState(true);
  try{
    const raw=localStorage.getItem(STORE_KEY);
    if(raw){
      const saved=JSON.parse(raw);
      if(saved && saved.resume && typeof saved.resume==="object"){
        state=Object.assign(newState(false),saved);
        state.resume=normalizeResume(saved.resume);
        state.versions=Array.isArray(saved.versions)?saved.versions.slice(0,30):[];
        if(!["modern","classic"].includes(state.template))state.template="modern";
      }
    }
  }catch(e){ /* Invalid storage is ignored; the user can start a new draft. */ }
  let currentPage="overview",activeSection="profile",source="editor";
  let importedText="",lastCheck=null,toastTimer=null;
  function persist(){
    try{localStorage.setItem(STORE_KEY,JSON.stringify(state));}
    catch(e){toast("Local storage is unavailable or full. Export JSON to keep your work.");}
  }
  function toast(message){
    const n=$("toast");n.textContent=message;n.classList.add("show");
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>n.classList.remove("show"),4000);
  }
  function isSectionComplete(key){
    const r=state.resume,p=r.profile;
    switch(key){
      case "profile":return !!p.fullName.trim() && !!p.email.trim() && !!p.summary.trim();
      case "skills":return Object.values(r.skills).some(a=>a.length);
      default:return (r[key]||[]).length>0;
    }
  }
  function renderOverview(){
    const readiness=analyzeReadiness(state.resume);
    const rMatch=matchKeywords(resumeToText(state.resume),state.jobDescription,state.customKeywords);
    $("dashCoverage").textContent=rMatch.totalJobKeywords?rMatch.percentage+"%":"—";
    $("dashCoverageCaption").textContent=rMatch.totalJobKeywords?rMatch.matchedCount+" of "+rMatch.totalJobKeywords+" recognized skills":"Choose a job description";
    $("dashReadiness").textContent=readiness.completed+"/"+readiness.total;
    $("dashReadinessCaption").textContent="Document quality checklist";
    $("dashPrompts").textContent=readiness.suggestions.length;
    $("dashVersions").textContent=state.versions.length;
    $("sampleBadge").textContent=state.sample?"Sample data — customize":"Working draft";
    const icons={profile:"◉",skills:"⌘",experience:"▣",projects:"◇",education:"▤",certifications:"✦",publications:"◈"};
    $("sectionProgress").innerHTML=sections.map(key=>{
      const yes=isSectionComplete(key);
      return '<div class="progress-line"><span class="progress-left"><span class="progress-symbol" aria-hidden="true">'+icons[key]+'</span>'+labelSection(key)+'</span><span class="progress-state">'+(yes?"✓ Drafted":"Add details")+'</span></div>';
    }).join("");
    const problems=readiness.suggestions.slice(0,4);
    $("improvementList").innerHTML=problems.length
      ?problems.map(x=>'<div class="improvement-row">'+escapeHtml(x)+'</div>').join("")
      :'<p class="card-muted" style="padding:20px 0">The basic checklist is complete. Review all claims and tailor them to each opportunity.</p>';
  }
  function labelSection(key){return key.charAt(0).toUpperCase()+key.slice(1);}
  function go(page){
    if(!headings[page])return;
    currentPage=page;
    Object.keys(headings).forEach(key=>$(key+"View").hidden=key!==page);
    document.querySelectorAll(".nav-link").forEach(b=>{
      const on=b.dataset.nav===page;b.classList.toggle("active",on);
      if(on)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");
    });
    $("breadcrumb").textContent=headings[page];
    $("sidebar").classList.remove("mobile-open");
    $("mobileMenuBtn").setAttribute("aria-expanded","false");
    if(page==="overview")renderOverview();
    if(page==="editor")renderEditor();
    if(page==="checker")renderChecker();
    if(page==="versions")renderVersions();
    if(page==="export")renderExport();
    window.scrollTo(0,0);
  }
  function fieldHTML(id,label,value,opts) {
    const settings=opts||{},type=settings.type||"text",attr=settings.attr||"";
    const field='<label for="'+id+'">'+escapeHtml(label)+'</label>';
    const input=type==="textarea"
      ?'<textarea id="'+id+'" '+attr+' rows="'+(settings.rows||4)+'" placeholder="'+escapeHtml(settings.placeholder||"")+'">'+escapeHtml(value||"")+'</textarea>'
      :'<input id="'+id+'" type="'+type+'" '+attr+' value="'+escapeHtml(value||"")+'" placeholder="'+escapeHtml(settings.placeholder||"")+'">';
    return '<div class="form-field '+(settings.span?"field-span":"")+'">'+field+input+'</div>';
  }
  function renderEditorFields(){
    $("editorTabs").querySelectorAll(".section-tab").forEach(b=>{
      b.classList.toggle("active",b.dataset.section===activeSection);
      b.setAttribute("aria-selected",b.dataset.section===activeSection?"true":"false");
    });
    const p=state.resume.profile;
    if(activeSection==="profile"){
      const fields=[
        ["fullName","Full name","text"],["headline","Professional headline","text"],
        ["email","Email address","email"],["phone","Phone number","tel"],
        ["location","City / location","text"],["website","Portfolio website","url"],
        ["linkedin","LinkedIn URL","url"],["github","GitHub URL","url"],
        ["summary","Professional summary","textarea"]
      ];
      $("editorFields").innerHTML='<div class="field-grid">'+fields.map(([key,label,type])=>
        fieldHTML("f-"+key,label,p[key],{type,attr:'data-profile="'+key+'"',span:key==="summary",rows:5})).join("")+'</div>'
        +'<p class="field-help">The public sample contains fictional details. Replace them with your own verified information before exporting.</p>';
    }else if(activeSection==="skills"){
      const labels={languages:"Languages",frameworks:"Frameworks & APIs",databases:"Databases & data",tools:"Tools & platforms"};
      $("editorFields").innerHTML='<p class="field-help">Use commas between skills. List only tools you can explain or demonstrate.</p>'
        +Object.keys(labels).map(key=>fieldHTML("skill-"+key,labels[key],state.resume.skills[key].join(", "),{
          type:"textarea",rows:2,attr:'data-skill="'+key+'"'})).join("");
    }else{
      const list=state.resume[activeSection]||[];
      $("editorFields").innerHTML=list.map((item,index)=>{
        const fields=listFields[activeSection].map(([key,label,type])=>
          fieldHTML("list-"+activeSection+"-"+index+"-"+key,label,item[key]||"",{
            type:type==="textarea"?"textarea":type==="url"?"url":"text",rows:type==="textarea"?4:2,
            attr:'data-list="'+activeSection+'" data-index="'+index+'" data-field="'+key+'"'})).join("");
        return '<div class="item-editor"><div class="item-editor-top"><strong>'+listLabels[activeSection]+' '+(index+1)+'</strong><button type="button" class="delete-btn" data-remove="'+activeSection+'" data-index="'+index+'">Remove</button></div>'+fields+'</div>';
      }).join("")+'<button type="button" class="add-btn" data-add="'+activeSection+'">+ Add '+listLabels[activeSection].toLowerCase()+'</button>';
    }
  }
  function renderEditor(){
    $("editingBadge").textContent=state.sample?"Editing sample — use your own details":"Your local working draft";
    $("templateSelect").value=state.template;
    renderEditorFields();renderPreview();
  }
  function renderPreview(){
    const doc=renderResumeDocument(state.resume,state.template);
    $("resumePreview").innerHTML=doc;
    $("printMount").innerHTML=doc;
    const readiness=analyzeReadiness(state.resume);
    const note=$("resumePreview").parentNode.querySelector(".preview-note");
    if(note)note.textContent=readiness.wordCount>680
      ?"Your resume has "+readiness.wordCount+" words. Check PDF page count; consider trimming for one page."
      :"Print layout is single-column and A4. Confirm page count in your browser's PDF preview.";
  }
  function edited(){
    state.sample=false;persist();renderPreview();renderOverview();
    $("editingBadge").textContent="Your local working draft";
  }
  $("editorFields").addEventListener("input",event=>{
    const el=event.target;
    if(el.dataset.profile){state.resume.profile[el.dataset.profile]=el.value;edited();}
    else if(el.dataset.skill){state.resume.skills[el.dataset.skill]=el.value.split(/[,;\n]/).map(s=>s.trim()).filter(Boolean);edited();}
    else if(el.dataset.list){
      const row=state.resume[el.dataset.list][Number(el.dataset.index)];
      if(row){row[el.dataset.field]=el.value;edited();}
    }
  });
  $("editorTabs").addEventListener("click",e=>{
    const b=e.target.closest("[data-section]");
    if(b){activeSection=b.dataset.section;renderEditorFields();}
  });
  $("editorFields").addEventListener("click",e=>{
    const add=e.target.closest("[data-add]"),remove=e.target.closest("[data-remove]");
    if(add){
      const list=add.dataset.add;
      const item={};listFields[list].forEach(x=>{item[x[0]]="";});
      state.resume[list].push(item);state.sample=false;persist();renderEditor();renderOverview();
    }
    if(remove){
      const list=remove.dataset.remove,index=Number(remove.dataset.index);
      state.resume[list].splice(index,1);state.sample=false;persist();renderEditor();renderOverview();
    }
  });
  function useSample(){
    if(!confirm("Replace your current resume with fictional example data? Save a version first if needed."))return;
    state.resume=normalizeResume(defaultResumeData);state.sample=true;persist();renderEditor();renderOverview();
    toast("Example resume loaded. Replace all sample details before applying.");
  }
  function useBlank(){
    if(!confirm("Start a blank resume? Your current draft will be replaced. Save a version first if needed."))return;
    state.resume=normalizeResume(emptyResumeData);state.sample=false;persist();renderEditor();renderOverview();
    toast("Blank resume ready.");
  }
  function saveVersion(){
    const name=prompt("Name this resume version (e.g. Backend Intern – Acme):","Application "+(state.versions.length+1));
    if(name===null)return;
    if(!name.trim()){toast("Enter a version name.");return;}
    const item={id:String(Date.now())+Math.random().toString(36).slice(2,7),name:name.trim().slice(0,90),
      createdAt:new Date().toISOString(),resume:clone(state.resume),jobDescription:state.jobDescription,jobPreset:state.jobPreset,customKeywords:state.customKeywords,template:state.template};
    state.versions.unshift(item);state.versions=state.versions.slice(0,25);
    persist();renderOverview();if(currentPage==="versions")renderVersions();toast("Version saved locally.");
  }
  function renderVersions(){
    const list=$("versionList");
    list.innerHTML=state.versions.length?state.versions.map(v=>
      '<div class="version-row"><div><strong>'+escapeHtml(v.name)+'</strong><small>'+escapeHtml(new Date(v.createdAt).toLocaleString())+'</small></div><div class="version-actions"><button type="button" data-v-action="restore" data-v-id="'+escapeHtml(v.id)+'">Restore</button><button type="button" data-v-action="delete" data-v-id="'+escapeHtml(v.id)+'">Delete</button></div></div>').join("")
      :'<p class="card-muted" style="padding:20px 0">No snapshots yet. Save your current resume to compare future versions.</p>';
    const options='<option value="">Select version</option>'+state.versions.map(v=>'<option value="'+escapeHtml(v.id)+'">'+escapeHtml(v.name)+'</option>').join("");
    $("compareA").innerHTML=options;$("compareB").innerHTML=options;
  }
  $("versionList").addEventListener("click",e=>{
    const b=e.target.closest("[data-v-action]");if(!b)return;
    const v=state.versions.find(x=>x.id===b.dataset.vId);if(!v)return;
    if(b.dataset.vAction==="delete"){
      if(!confirm("Permanently delete saved version "+v.name+" from this device?"))return;
      state.versions=state.versions.filter(x=>x.id!==v.id);persist();renderVersions();renderOverview();toast("Version deleted.");
    }else{
      if(!confirm("Restore "+v.name+"? This replaces your current draft. Save it first if needed."))return;
      state.resume=normalizeResume(v.resume);state.jobDescription=v.jobDescription||"";
      state.jobPreset=v.jobPreset||"custom";state.customKeywords=v.customKeywords||"";state.template=v.template||"modern";state.sample=false;
      persist();go("editor");toast("Version restored.");
    }
  });
  $("compareBtn").addEventListener("click",()=>{
    const a=state.versions.find(x=>x.id===$("compareA").value),b=state.versions.find(x=>x.id===$("compareB").value);
    if(!a||!b){$("compareOutput").textContent="Select two saved versions to compare.";return;}
    const changes=compareResumes(a.resume,b.resume);
    $("compareOutput").innerHTML='<p><strong>'+changes.filter(x=>x.changed).length+' sections changed</strong></p>'
      +changes.map(x=>'<div class="diff-row '+(x.changed?"diff-changed":"diff-same")+'">'+(x.changed?"● Changed: ":"✓ Unchanged: ")+escapeHtml(labelSection(x.section))+'</div>').join("");
  });
  function renderChecker(){
    $("jobPreset").value=state.jobPreset;
    $("jobTitle").value=state.jobTitle||"";
    $("jobDescription").value=state.jobDescription||"";
    $("customKeywords").value=state.customKeywords||"";
    document.querySelectorAll('input[name="resumeSource"]').forEach(el=>{el.checked=el.value===source;});
    $("uploadPanel").hidden=source!=="upload";
    $("resumePaste").value=importedText;
    if(lastCheck)displayCheckerResults(lastCheck);
  }
  function getUploadedChecks(text){
    const body=String(text||""),checks=[
      {label:"Contact email found",pass:/[^\s@]+@[^\s@]+\.[^\s@]+/.test(body)},
      {label:"Skills heading or section found",pass:/\b(?:skills|technical skills|competencies)\b/i.test(body)},
      {label:"Education heading found",pass:/\beducation\b/i.test(body)},
      {label:"Project or experience heading found",pass:/\b(?:projects|experience|employment|work history)\b/i.test(body)},
      {label:"Plain text extracted successfully",pass:body.trim().length>120}
    ];
    return {checks,completed:checks.filter(x=>x.pass).length,total:checks.length,
      wordCount:(body.match(/\b[\w#+.-]+\b/g)||[]).length};
  }
  function runCheck(){
    const desc=$("jobDescription").value.trim();
    if(desc.length<30){toast("Paste a meaningful job description (at least 30 characters).");return;}
    const text=source==="editor"?resumeToText(state.resume):importedText.trim();
    if(text.length<30){toast("Add your resume content first.");return;}
    const match=matchKeywords(text,desc,state.customKeywords);
    const readiness=source==="editor"?analyzeReadiness(state.resume):getUploadedChecks(text);
    lastCheck={match,readiness,source};
    displayCheckerResults(lastCheck);
    if(match.totalJobKeywords===0)toast("No recognized skills found. Paste a more detailed description or see the documented skill dictionary.");
    else toast("Analysis complete — "+match.matchedCount+" of "+match.totalJobKeywords+" requirements found.");
    renderOverview();
  }
  function displayCheckerResults(result){
    $("checkerPlaceholder").hidden=true;$("checkerResults").hidden=false;
    const m=result.match,r=result.readiness;
    const found=m.totalJobKeywords>0;
    const ring='<div class="score-ring"><span>'+(found?m.percentage+"%":"—")+'</span></div>';
    const label=found
      ?'<strong>Recognized skill coverage</strong><p>'+m.matchedCount+' of '+m.totalJobKeywords+' skills identified in the job text also appear in your resume.</p>'
      :'<strong>Insufficient job terms</strong><p>No skills in our published dictionary were detected. Your description may need more detail.</p>';
    const pills=(list,missing)=>list.length?list.map(x=>'<span class="skill-pill'+(missing?" missing":"")+'">'+escapeHtml(x)+'</span>').join(""):'<span class="card-muted">None identified</span>';
    const suggestions=m.missing.length?'<p class="card-muted">If you genuinely have these skills, describe how you used them in an actual project or job. Never add unearned keywords.</p>':'<p class="card-muted">Keyword matches are not a substitute for demonstrating evidence and impact.</p>';
    $("checkerResults").innerHTML=
      '<article class="white-card result-card"><div class="result-score">'+ring+'<div class="score-copy">'+label+'</div></div><p class="card-muted">This is a transparent keyword heuristic, not an official ATS rating.</p></article>'
      +'<article class="white-card result-card"><h2>Matched skills</h2><div class="skill-pills">'+pills(m.matched,false)+'</div></article>'
      +'<article class="white-card result-card"><h2>Missing recognized skills</h2><div class="skill-pills">'+pills(m.missing,true)+'</div>'+suggestions+'</article>'
      +'<article class="white-card result-card"><h2>Resume readiness <span class="card-muted">('+r.completed+'/'+r.total+')</span></h2><p class="card-muted">'+r.wordCount+' words examined; '+(result.source==="upload"?"basic uploaded-text checks":"builder resume quality checks")+'.</p><ul class="readiness-list">'
      +r.checks.map(x=>'<li class="'+(x.pass?"":"needs")+'"><span>'+(x.pass?"✓":"!")+'</span>'+escapeHtml(x.label)+'</li>').join("")
      +'</ul></article>';
  }
  $("jobPreset").addEventListener("change",e=>{
    const name=e.target.value;state.jobPreset=name;
    if(sampleJobDescriptions[name])state.jobDescription=sampleJobDescriptions[name].text;
    $("jobDescription").value=state.jobDescription;
    if(name!=="custom")$("jobTitle").value=sampleJobDescriptions[name].title;
    state.jobTitle=$("jobTitle").value;
    persist();lastCheck=null;$("checkerResults").hidden=true;$("checkerPlaceholder").hidden=false;
  });
  $("jobDescription").addEventListener("input",e=>{state.jobDescription=e.target.value;state.jobPreset="custom";$("jobPreset").value="custom";persist();});
  $("jobTitle").addEventListener("input",e=>{state.jobTitle=e.target.value;persist();});
  $("customKeywords").addEventListener("input",e=>{state.customKeywords=e.target.value.slice(0,5000);persist();});
  document.querySelectorAll('input[name="resumeSource"]').forEach(el=>el.addEventListener("change",()=>{
    source=document.querySelector('input[name="resumeSource"]:checked').value;
    $("uploadPanel").hidden=source!=="upload";lastCheck=null;$("checkerResults").hidden=true;$("checkerPlaceholder").hidden=false;
  }));
  $("resumePaste").addEventListener("input",e=>{importedText=e.target.value;$("parseStatus").textContent="Pasted resume text ready for analysis.";});
  async function loadScript(url,globalName){
    if(window[globalName])return;
    await new Promise((resolve,reject)=>{
      const s=document.createElement("script");s.src=url;s.async=true;
      s.onload=resolve;s.onerror=()=>reject(new Error("Parser library could not be loaded. Paste text instead."));
      document.head.appendChild(s);
    });
  }
  $("resumeFile").addEventListener("change",async e=>{
    const file=e.target.files&&e.target.files[0];if(!file)return;
    if(file.size>10*1024*1024){$("parseStatus").textContent="File is too large (10 MB limit).";return;}
    $("parseStatus").textContent="Reading "+file.name+" locally...";
    try{
      const name=file.name.toLowerCase();
      if(name.endsWith(".txt")||name.endsWith(".md")){
        importedText=await file.text();
      }else if(name.endsWith(".pdf")){
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js","pdfjsLib");
        window.pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        const pdf=await window.pdfjsLib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;
        const pages=[];
        for(let n=1;n<=Math.min(pdf.numPages,25);n++){
          const page=await pdf.getPage(n);
          const text=await page.getTextContent();
          pages.push(text.items.map(x=>x.str).join(" "));
        }
        importedText=pages.join("\n");
      }else if(name.endsWith(".docx")){
        await loadScript("https://cdn.jsdelivr.net/npm/mammoth@1.9.1/mammoth.browser.min.js","mammoth");
        const result=await window.mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()});
        importedText=result.value||"";
      }else throw new Error("Use PDF, DOCX, TXT or MD.");
      if(importedText.trim().length<30)throw new Error("Very little selectable text was found. Scanned PDFs may need OCR; paste text manually.");
      $("resumePaste").value=importedText;
      $("parseStatus").textContent="Loaded "+file.name+" ("+importedText.length+" characters). The file was not uploaded to a CivicFolio server.";
    }catch(err){$("parseStatus").textContent=err.message||"Unable to read file. Paste your resume text manually.";toast("Resume import failed. You can paste text instead.");}
  });
  function renderExport(){
    $("exportTemplate").value=state.template;
    const checked=validateResume(state.resume),readiness=analyzeReadiness(state.resume);
    const messages=checked.errors.concat(readiness.wordCount>680?["Resume is over 680 words; check printed page count."]:[]);
    if(state.sample)messages.unshift("The document still contains fictional example data.");
    $("exportReview").innerHTML=messages.length
      ?'<ul class="readiness-list">'+messages.map(x=>'<li class="needs"><span>!</span>'+escapeHtml(x)+'</li>').join("")+'</ul>'
      :'<p style="color:#2e7452">✓ Basic required fields are present. Review every fact and the PDF page count.</p>';
  }
  function printResume(){
    const validation=validateResume(state.resume);
    if(!validation.isValid&&!confirm(validation.errors.join("\n")+"\n\nPrint incomplete resume anyway?"))return;
    if(state.sample&&!confirm("This contains fictional example details. Print sample resume anyway?"))return;
    const quality=analyzeReadiness(state.resume);
    if(quality.wordCount>680&&!confirm("This resume may exceed one page. Continue to print preview?"))return;
    renderPreview();window.print();
  }
  function exportJSON(){
    const data={format:"civicfolio-workspace-v2",exportedAt:new Date().toISOString(),...state};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob),link=document.createElement("a");
    link.href=url;link.download="civicfolio-workspace.json";document.body.appendChild(link);link.click();
    link.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);toast("Workspace exported as JSON.");
  }
  $("importJsonInput").addEventListener("change",async e=>{
    const file=e.target.files[0];if(!file)return;
    try{
      if(file.size>2*1024*1024)throw new Error("JSON backup must be under 2 MB.");
      const parsed=JSON.parse(await file.text());
      if(!parsed||parsed.format!=="civicfolio-workspace-v2"||!parsed.resume)throw new Error("Not a CivicFolio v2 backup.");
      if(!confirm("Replace your current local workspace with this backup?"))return;
      state=newState(false);
      state.resume=normalizeResume(parsed.resume);
      state.sample=!!parsed.sample;
      state.jobDescription=String(parsed.jobDescription||"").slice(0,30000);
      state.jobPreset=sampleJobDescriptions[parsed.jobPreset]?parsed.jobPreset:"custom";
      state.jobTitle=String(parsed.jobTitle||"").slice(0,180);
      state.customKeywords=String(parsed.customKeywords||"").slice(0,5000);
      state.template=["modern","classic"].includes(parsed.template)?parsed.template:"modern";
      state.versions=Array.isArray(parsed.versions)?parsed.versions.slice(0,25).filter(x=>x&&x.resume&&x.id):[];
      persist();go("overview");toast("Workspace restored from backup.");
    }catch(err){toast(err.message||"Unable to import this JSON backup.");}
    finally{e.target.value="";}
  });
  document.addEventListener("click",e=>{
    const nav=e.target.closest("[data-nav]");
    if(nav){go(nav.dataset.nav);return;}
  });
  $("mobileMenuBtn").addEventListener("click",()=>{
    const open=$("sidebar").classList.toggle("mobile-open");
    $("mobileMenuBtn").setAttribute("aria-expanded",open?"true":"false");
  });
  $("clearDataBtn").addEventListener("click",()=>{
    if(!confirm("Clear all saved resumes, job descriptions and snapshots from this browser? Export JSON first if needed."))return;
    state=newState(false);importedText="";lastCheck=null;localStorage.removeItem(STORE_KEY);go("overview");toast("Local workspace cleared.");
  });
  $("loadSampleBtn").addEventListener("click",useSample);
  $("startBlankBtn").addEventListener("click",useBlank);
  $("saveSnapshotBtn").addEventListener("click",saveVersion);
  $("versionSaveBtn").addEventListener("click",saveVersion);
  $("templateSelect").addEventListener("change",e=>{state.template=e.target.value;persist();renderPreview();});
  $("exportTemplate").addEventListener("change",e=>{state.template=e.target.value;persist();renderPreview();});
  $("checkerOpenEditorBtn").addEventListener("click",()=>go("editor"));
  $("runCheckBtn").addEventListener("click",runCheck);
  $("editorPrintBtn").addEventListener("click",printResume);
  $("exportPdfBtn").addEventListener("click",printResume);
  $("exportJsonBtn").addEventListener("click",exportJSON);
  renderPreview();renderOverview();go("overview");
});
