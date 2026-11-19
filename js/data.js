// CivicFolio Truthful Data Store
const defaultResumeData = {
  profile: {
    fullName: "Bhuvan Batra",
    headline: "AI & ML Undergraduate | Python & Backend Engineering",
    email: "bhuvanbatra17may2006@gmail.com",
    phone: "+91-XXXXXXXXXX", // Rendered strictly on downloadable resume
    location: "Chandigarh, India",
    linkedin: "https://www.linkedin.com/in/bhuvan-batra-a75267220/",
    github: "https://github.com/HuMaN-OG",
    summary: "B.E. student specializing in Artificial Intelligence and Machine Learning at Chandigarh University (2024-2028). Passionate about robust backend architectures, digital public services, and practical applied AI."
  },
  education: [
    {
      institution: "Chandigarh University",
      degree: "Bachelor of Engineering (B.E.), AI & ML",
      dates: "2024 - 2028",
      cgpa: "6.66 / 10.0",
      notes: "Relevant Coursework: Data Structures, Database Systems, Computer Networks, Applied Machine Learning"
    }
  ],
  skills: {
    languages: ["Python", "JavaScript", "C++", "SQL"],
    frameworks: ["FastAPI", "Flask", "Node.js", "Express.js", "React"],
    databases: ["SQLite", "MongoDB", "PostgreSQL"],
    tools: ["Git", "GitHub Actions", "Docker", "REST APIs", "Linux"]
  },
  projects: [
    {
      title: "Disaster Triaging System",
      role: "Backend & ML Pipeline Contributor",
      link: "https://github.com/HuMaN-OG/Disaster-Triaging",
      description: "Research prototype triaging multimodal disaster distress reports across English, Hindi, and Hinglish with role-based access control and strict authentication."
    },
    {
      title: "University Information Chatbot",
      role: "Backend & NLP Developer",
      link: "https://github.com/HuMaN-OG/University-Chatbot",
      description: "Student assistance portal combining TF-IDF intent matching with secure JWT administration and rate limiting for university service queries."
    },
    {
      title: "FORGE AI Computer-Use Engine",
      role: "Backend & AI Lead",
      link: "https://github.com/HuMaN-OG/Forge",
      description: "Desktop automation platform with Express orchestrator, human approval gates, and a sandboxed FastAPI execution runtime."
    },
    {
      title: "Full-Stack Expense Tracker",
      role: "Sole Developer",
      link: "https://github.com/HuMaN-OG/Expense-Tracker",
      description: "Personal finance tracker with Express, MongoDB, analytics dashboards, CSV exports, and database health verification."
    }
  ],
  publications: [
    {
      title: "Enhancing Lung Cancer Screening by Analysing Clinically Symptoms Using Machine Learning",
      venue: "IEEE ICWITE 2025",
      doi: "10.1109/ICWITE64848.2025.11307058",
      link: "https://doi.org/10.1109/ICWITE64848.2025.11307058"
    }
  ]
};

const sampleJobDescriptions = {
  egov: {
    title: "Public Sector Software & Data Systems Intern",
    text: "Looking for an engineering intern with strong Python, backend API, and database skills. Responsibilities include building citizen-facing REST services, database integration, maintaining data integrity, unit testing, and technical documentation."
  },
  backend: {
    title: "Backend Engineer Intern",
    text: "Seeking backend developer with Node.js, Express, Python, MongoDB, SQL, and Docker experience. Focus on RESTful APIs, authentication, testing, and security."
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { defaultResumeData, sampleJobDescriptions };
}
