# CivicFolio public-sector case study

This case study preserves the specific use case that motivated CivicFolio's earlier public-sector prototype. It is **not** a second deployed product or a claim that any example project was deployed by a government agency.

## The problem

An AI/ML undergraduate preparing for National Informatics Centre (NIC)-style software and digital-services opportunities needs two outputs: a truthful, editable resume and a concise explanation of why individual engineering projects relate to data integrity, public-service access, and reliable backends. A generic keyword score is not sufficient evidence of competence.

The first prototype combined a resume view, a public-sector job matcher, a short project showcase and browser PDF printing. The maintained app broadened this into a general-purpose resume workspace with multi-role job examples, imported-document checks, version comparison, data portability, an A4 layout, and broader automated checks.

## What was retained in the maintained CivicFolio app

| Legacy idea | Where to find it now |
| --- | --- |
| Match a resume to a public-sector technology brief | ATS-style checker → **Digital Public Services Intern** sample, or paste an actual notice |
| Explain project relevance using evidence | Resume builder → **Projects**, with links and concrete implementation details |
| Include scholarly work only when documented | Resume builder → **Publications**, with a verifiable DOI |
| Export a concise, readable resume | Export centre → Classic or Modern → Print / Save as PDF |
| Avoid unexplained proprietary ATS percentages | Matched / missing recognized requirements and the transparent skill-alias matcher |
| A straightforward browser-based interface | Responsive editor, preview, version history and local workspace storage |

There is intentionally no hard-coded “NIC mode” that narrows the application to one employer, and no real candidate's personal data ships as the default profile.

## Evidence-led project showcase: original examples

These examples came from the v1 showcase and illustrate **possible alignment**, not employer endorsements or independently verified impact metrics. Verify each repository's current behavior before putting a statement into a submitted resume.

- [Disaster-Triaging](https://github.com/HuMaN-OG/Disaster-Triaging): multilingual emergency-report triage and access-controlled responder workflows. Discuss input validation, who can see sensitive reports, and what evaluation data support the model.
- [University-Chatbot](https://github.com/HuMaN-OG/University-Chatbot): institutional information retrieval with administrative controls. Discuss updating the knowledge base, authentication and handling unanswered queries.
- [Forge](https://github.com/HuMaN-OG/Forge): orchestrated automation with approval gates. Discuss how risky operations are constrained and logged.
- [Expense-Tracker](https://github.com/HuMaN-OG/Expense-Tracker): persistent records, CRUD operations and report exports. Discuss transaction validation, failure handling and the difference between a prototype and a production financial system.
- A candidate may also cite a publication with an authentic DOI, for example the public [IEEE ICWITE 2025 entry](https://doi.org/10.1109/ICWITE64848.2025.11307058), **only if they are an author**.

## Reproduce the original scenario in today's product

1. Open [CivicFolio](https://human-og.github.io/CivicFolio/) and choose **Start blank** or load the **fictional** example.
2. Enter only your own verifiable projects, education and skills. Link source repositories and include measured results only when evidenced.
3. Open **ATS-style checker**, choose **Digital Public Services Intern** and run the comparison. For a real application, replace the sample text with its actual job notice.
4. Inspect which recognized skills are present or absent; the dictionary is not a hiring prediction and missing tokens are not proof of missing ability.
5. Save a named version, compare it with a later tailored version and export a single-column PDF.

## Historical code and migration notes

The maintained repository contains the [shared v1 history at commit `e9820769cf5183ee28f8dcf8687db69a6f0075ed`](https://github.com/HuMaN-OG/CivicFolio/tree/e9820769cf5183ee28f8dcf8687db69a6f0075ed), so earlier code remains inspectable through **this repository** without keeping another mirror. The obsolete `CivicFolio-Prototype` repository's only two subsequent changes were a legacy notice in its README and removal of an unsuccessful Pages deployment workflow; no newer feature implementation needed to be transplanted.

This case study retains the distinctive public-sector showcase and its learning context without maintaining a second application or copying a real person's private data into the general-purpose demo.
