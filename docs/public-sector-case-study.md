# CivicFolio — career-readiness and digital-services case study

This case study documents an illustrative workflow for assessing technical experience, adapting a resume to a role, and explaining engineering projects with verifiable evidence. **It is not associated with, tailored to, or endorsed by any specific employer or institution.** The application itself is designed for students, early-career professionals, and applicants across public, private, nonprofit, and research settings.

## The problem

Candidates applying to different technical roles often need to edit their resumes repeatedly, understand which job requirements their documents actually demonstrate, and present credible project outcomes. Keyword scores alone cannot establish competence or predict hiring decisions. The problem is especially visible in software engineering, AI/ML, data analytics, deployment operations, and digital-services work.

The early CivicFolio prototype demonstrated a small resume editor, job-description matching, a technical-project showcase, and browser PDF printing. The maintained app now supports general-purpose editing, multiple sample role categories, imported-document checks, version comparison, data portability, PDF printing, and broader automated checks.

## What is available in the maintained application

| User need | CivicFolio workflow |
| --- | --- |
| Present an authentic professional profile | Resume builder → editable experience, education, projects, skills, certifications and publications |
| Compare a resume with a technical opportunity | ATS-style checker → paste any job description or choose a **generic** sample role |
| Explain technical projects | Resume builder → Projects, with repository links, implementation details and evidence |
| Assess visible skill coverage | Matched and missing recognized terms with a transparent dictionary-based matcher |
| Tailor the same resume to several roles | Save labeled versions; compare changes and restore a previous snapshot |
| Produce a shareable document | Export centre → single-column PDF through browser printing |
| Keep personal data on the current device | Browser local storage and JSON export/import for backup |

No employer-specific mode is required, and the shipped default candidate is fictional.

## Transferable technical-project examples

These project examples illustrate how a candidate might explain engineering competencies. They do **not** imply independent verification, external adoption, public deployment impact, or any hiring endorsement. Confirm each repository's present implementation before using a claim in an application.

- [Disaster Triaging](https://github.com/HuMaN-OG/Disaster-Triaging): multilingual report processing and role-based workflows; relevant themes include input validation, reliability, and sensitive-data handling
- [University Chatbot](https://github.com/HuMaN-OG/University-Chatbot): information retrieval and administration; relevant themes include authentication, updates, and handling unknown questions
- [Forge](https://github.com/HuMaN-OG/Forge): controlled automation and approvals; relevant themes include safety gates, auditability, and isolation
- [Expense Tracker](https://github.com/HuMaN-OG/Expense-Tracker): persistent records, APIs, and reporting; relevant themes include validation, data integrity, and error handling

For publications or certifications, include only achievements the candidate can substantiate with a reliable link or document.

## Reproduce the workflow without targeting a named employer

1. Open the [live CivicFolio application](https://human-og.github.io/CivicFolio/) and select **Start blank** or load the clearly labeled fictional example.
2. Add your own accurate skills, project results, and links. Leave out unverifiable achievements.
3. Open **ATS-style checker** and choose a generic sample role (software, backend, data, ML, deployment, product, or digital services) or paste an actual job description.
4. Inspect the recognized matches and gaps. A missing keyword does not establish that the candidate lacks a competency; an apparent match does not prove proficiency.
5. Save a version for the role, compare it with another version, then print a single-column resume to PDF.

## Prototype history and scope

The canonical repository retains the [shared original prototype commit `e9820769cf5183ee28f8dcf8687db69a6f0075ed`](https://github.com/HuMaN-OG/CivicFolio/tree/e9820769cf5183ee28f8dcf8687db69a6f0075ed). The redundant prototype repository's only later commits added a legacy notice and retired its old Pages deployment workflow. No additional application feature needs to be copied from that mirror.

The case study preserves the original learning context while presenting CivicFolio as a reusable, employer-neutral portfolio project. It is an illustrative use case, not a proprietary applicant tracking system or a guaranteed hiring predictor.
