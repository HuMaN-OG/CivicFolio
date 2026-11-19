/* Optional Playwright smoke test. Run by .github/workflows/browser-smoke.yml. */
const {chromium}=require("playwright");
const assert=require("node:assert/strict");
const fs=require("node:fs");
(async function(){
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:960}});
  const errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  fs.mkdirSync("artifacts",{recursive:true});
  try{
    await page.goto("http://127.0.0.1:8765/",{waitUntil:"networkidle"});
    await page.locator("#dashReadiness").waitFor();
    assert.ok((await page.locator("#dashReadiness").innerText()).includes("/"));
    await page.screenshot({path:"artifacts/civicfolio-overview.png",fullPage:true});

    await page.locator('[data-nav="editor"]').first().click();
    await page.locator("#f-fullName").fill("Taylor Example");
    assert.equal((await page.locator("#resumePreview h1").innerText()),"Taylor Example");
    await page.locator('[data-section="projects"]').click();
    await page.locator('[data-add="projects"]').click();
    const lastTitle=page.locator('[data-list="projects"][data-field="title"]').last();
    await lastTitle.fill("Portfolio Evidence App");
    assert.ok((await page.locator("#resumePreview").innerText()).includes("Portfolio Evidence App"));
    await page.screenshot({path:"artifacts/civicfolio-editor.png",fullPage:true});

    await page.locator('[data-nav="checker"]').first().click();
    await page.locator("#jobPreset").selectOption("backend");
    await page.locator("#runCheckBtn").click();
    await page.locator("#checkerResults").waitFor({state:"visible"});
    assert.ok((await page.locator("#checkerResults").innerText()).includes("Recognized skill coverage"));
    await page.screenshot({path:"artifacts/civicfolio-checker.png",fullPage:true});

    await page.locator('[data-nav="versions"]').first().click();
    page.once("dialog",d=>d.accept("Smoke test role"));
    await page.locator("#versionSaveBtn").click();
    assert.ok((await page.locator("#versionList").innerText()).includes("Smoke test role"));

    await page.locator('[data-nav="export"]').first().click();
    const pdf=await page.pdf({format:"A4",printBackground:true});
    assert.equal(pdf.subarray(0,4).toString(),"%PDF");
    fs.writeFileSync("artifacts/fictional-sample-resume.pdf",pdf);

    // Confirm an actual generated PDF can be read back by the ATS-style importer.
    await page.locator('[data-nav="checker"]').first().click();
    await page.locator('input[name="resumeSource"][value="upload"]').check();
    await page.locator("#resumeFile").setInputFiles("artifacts/fictional-sample-resume.pdf");
    await page.waitForFunction(() => document.querySelector("#parseStatus").textContent.startsWith("Loaded"),null,{timeout:35000});
    await page.locator("#runCheckBtn").click();
    assert.ok((await page.locator("#checkerResults").innerText()).includes("Recognized skill coverage"));

    await page.locator('[data-nav="export"]').first().click();
    await page.setViewportSize({width:390,height:844});
    await page.evaluate(() => {document.documentElement.style.scrollBehavior="auto";window.scrollTo(0,0);});
    await page.waitForTimeout(250);
    await page.screenshot({path:"artifacts/civicfolio-mobile-closed.png",fullPage:true});
    await page.locator("#mobileMenuBtn").click();
    assert.ok(await page.locator("#sidebar").evaluate(el=>el.classList.contains("mobile-open")));
    await page.waitForTimeout(350);
    await page.screenshot({path:"artifacts/civicfolio-mobile.png",fullPage:true});
    assert.deepEqual(errors,[],"Unexpected browser JavaScript errors");
    console.log("CivicFolio browser smoke PASSED: overview, editing, ATS check, snapshot, PDF export/import and mobile navigation.");
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
