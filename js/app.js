document.addEventListener("DOMContentLoaded", () => {
  // Input fields
  const inputName = document.getElementById("inputName");
  const inputHeadline = document.getElementById("inputHeadline");
  const inputSummary = document.getElementById("inputSummary");
  const inputCGPA = document.getElementById("inputCGPA");

  // Display fields
  const displayFullName = document.getElementById("displayFullName");
  const displayHeadline = document.getElementById("displayHeadline");
  const displaySummary = document.getElementById("displaySummary");
  const displayCGPA = document.getElementById("displayCGPA");

  // Sync inputs to preview
  inputName.addEventListener("input", (e) => {
    displayFullName.textContent = e.target.value.trim() || "Candidate Name";
    validateCurrentState();
  });

  inputHeadline.addEventListener("input", (e) => {
    displayHeadline.textContent = e.target.value.trim() || "Professional Role";
  });

  inputSummary.addEventListener("input", (e) => {
    displaySummary.textContent = e.target.value.trim() || "Summary goes here.";
  });

  inputCGPA.addEventListener("input", (e) => {
    displayCGPA.textContent = e.target.value.trim() || "N/A";
  });

  // Tab switching
  const tabs = [
    { btn: "tab-edit", view: "view-edit" },
    { btn: "tab-match", view: "view-match" },
    { btn: "tab-showcase", view: "view-showcase" }
  ];

  tabs.forEach(({ btn, view }) => {
    const button = document.getElementById(btn);
    button.addEventListener("click", () => {
      tabs.forEach(t => {
        document.getElementById(t.btn).classList.remove("active");
        document.getElementById(t.btn).setAttribute("aria-selected", "false");
        document.getElementById(t.view).style.display = "none";
      });
      button.classList.add("active");
      button.setAttribute("aria-selected", "true");
      document.getElementById(view).style.display = "block";
    });
  });

  // Keyword Matcher setup
  const selectPreset = document.getElementById("selectJobPreset");
  const jobDescText = document.getElementById("jobDescText");
  const runMatchBtn = document.getElementById("runMatchBtn");
  const matchOutput = document.getElementById("matchOutput");
  const coverageScore = document.getElementById("coverageScore");
  const matchedPills = document.getElementById("matchedPills");
  const missingPills = document.getElementById("missingPills");

  if (sampleJobDescriptions && sampleJobDescriptions.egov) {
    jobDescText.value = sampleJobDescriptions.egov.text;
  }

  selectPreset.addEventListener("change", (e) => {
    const key = e.target.value;
    if (sampleJobDescriptions[key]) {
      jobDescText.value = sampleJobDescriptions[key].text;
    }
  });

  runMatchBtn.addEventListener("click", () => {
    const text = jobDescText.value;
    const match = matchKeywords(defaultResumeData.skills, text);
    
    coverageScore.textContent = `${match.percentage}%`;
    matchedPills.innerHTML = "";
    missingPills.innerHTML = "";

    match.matched.forEach(keyword => {
      const span = document.createElement("span");
      span.className = "pill";
      span.style.background = "#dcfce7";
      span.style.color = "#166534";
      span.textContent = keyword;
      matchedPills.appendChild(span);
    });

    match.missing.forEach(keyword => {
      const span = document.createElement("span");
      span.className = "pill";
      span.style.background = "#fee2e2";
      span.style.color = "#991b1b";
      span.textContent = keyword;
      missingPills.appendChild(span);
    });

    matchOutput.style.display = "block";
  });

  // Validation Check
  function validateCurrentState() {
    const checkData = {
      profile: {
        fullName: inputName.value,
        email: "bhuvanbatra17may2006@gmail.com"
      },
      education: defaultResumeData.education,
      projects: defaultResumeData.projects
    };
    const result = validateResume(checkData);
    const alertBox = document.getElementById("validationAlert");
    if (!result.isValid) {
      alertBox.textContent = `Warning: ${result.errors.join(" ")}`;
      alertBox.style.display = "block";
    } else {
      alertBox.style.display = "none";
    }
    return result.isValid;
  }

  // Version switcher
  const versions = [
    "E-Gov & Public Sector",
    "Backend & Data Systems",
    "Applied AI & ML"
  ];
  let currentVerIndex = 0;
  const versionBtn = document.getElementById("versionToggleBtn");

  versionBtn.addEventListener("click", () => {
    currentVerIndex = (currentVerIndex + 1) % versions.length;
    const activeVer = versions[currentVerIndex];
    versionBtn.textContent = `Version: ${activeVer}`;

    if (activeVer === "Backend & Data Systems") {
      inputHeadline.value = "Backend & Data Systems Engineer | Python & Node.js";
      displayHeadline.textContent = inputHeadline.value;
    } else if (activeVer === "Applied AI & ML") {
      inputHeadline.value = "AI & Machine Learning Undergraduate | Applied Models & Systems";
      displayHeadline.textContent = inputHeadline.value;
    } else {
      inputHeadline.value = "AI & ML Undergraduate | Python & Backend Engineering";
      displayHeadline.textContent = inputHeadline.value;
    }
  });

  // Print / PDF Export
  const printBtn = document.getElementById("printResumeBtn");
  printBtn.addEventListener("click", () => {
    if (validateCurrentState()) {
      window.print();
    }
  });
});
