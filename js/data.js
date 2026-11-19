/* CivicFolio sample data: fictional and explicitly labeled. No real resume data is shipped. */
const defaultResumeData = {
  profile: {
    fullName: "Alex Morgan",
    headline: "Software Engineering Undergraduate",
    email: "alex.morgan@example.com",
    phone: "",
    location: "Your city",
    linkedin: "",
    github: "",
    website: "",
    summary: "Computer science student focused on building reliable web applications and APIs. Interested in backend development, accessible interfaces, and practical engineering."
  },
  skills: {
    languages: ["Python", "JavaScript", "SQL"],
    frameworks: ["React", "Node.js", "Express", "REST APIs"],
    databases: ["SQLite", "Database Management"],
    tools: ["Git", "GitHub Actions", "Testing"]
  },
  education: [
    { institution: "Example University", degree: "B.Sc. Computer Science", dates: "2023 – 2027", details: "Coursework: Databases, data structures, software engineering" }
  ],
  experience: [
    { title: "Student Developer", company: "Campus Project Team", dates: "2025 – Present",
      bullets: "Implemented REST API endpoints for a student project with input validation.\nCollaborated with teammates using pull requests and issue tracking." }
  ],
  projects: [
    { title: "Task Management App", tech: "React, Node.js, SQLite", dates: "2025",
      url: "", bullets: "Built task creation, status updates, and filtering for a sample team workflow.\nAdded basic input validation and API tests." }
  ],
  certifications: [],
  publications: []
};

const emptyResumeData = {
  profile: {fullName:"", headline:"", email:"", phone:"", location:"", linkedin:"", github:"", website:"", summary:""},
  skills: {languages:[],frameworks:[],databases:[],tools:[]},
  education: [], experience: [], projects: [], certifications: [], publications: []
};

/* Generic examples, not scraped or represented as current employer vacancies. */
const sampleJobDescriptions = {
  software: {title:"Software Engineer", text:"Seeking software engineer with JavaScript, Python, data structures, Git, unit testing, REST APIs, SQL, collaboration and technical documentation skills."},
  backend: {title:"Backend Developer", text:"Build APIs using Python, FastAPI or Node.js with SQL databases, authentication, testing, Docker, Git and continuous integration."},
  data: {title:"Data Analyst", text:"Analyze and report data using SQL, Python, Excel, Power BI, data visualization, dashboards, statistics, and stakeholder communication."},
  ml: {title:"Machine Learning Engineer", text:"Develop machine learning models using Python, scikit-learn, NLP, model evaluation, feature engineering, data pipelines, and Git."},
  deployment: {title:"Deployment Analyst", text:"Support application deployment, release management, user training, technical documentation, stakeholder management, change management, SAP, Power BI, troubleshooting, and reporting."},
  product: {title:"Product Analyst", text:"Use SQL, Excel, analytics, dashboards, product metrics, user research, stakeholder communication, A/B testing, and reporting."},
  custom: {title:"Custom job description", text:""}
};
sampleJobDescriptions.egov = {title:"Digital Public Services Intern",text:"Looking for Python, backend APIs, database integration, REST services, security, testing, technical documentation and data integrity skills."};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { defaultResumeData, emptyResumeData, sampleJobDescriptions };
}
