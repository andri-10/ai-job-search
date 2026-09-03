---
name: workinfinland-search
description: Manually search Work in Finland for paid, English-speaking Master's-thesis internships and thesis-worker roles in Finland. Use for Finnish thesis projects, Master's thesis worker, diplomityö, opinnäytetyö, tutkimusapulainen, or relevant vacancies on workinfinland.com; do not use it for general internships without a thesis component.
---

# Work in Finland — Master’s-thesis search

Use the public [Work in Finland open-jobs page](https://www.workinfinland.com/en/open-jobs/)
in a normal browser. It is the primary Finnish discovery source because it targets
English-speaking international candidates and includes technology, software, deep-tech,
engineering, academic, and internship categories.

The results are loaded dynamically. Job Market Finland’s official retrieval API requires
organisation approval and credentials, so treat this source as browser-assisted only:
do not use `curl`, reverse-engineer internal requests, call undocumented endpoints, or
automate pagination and detail collection.

Before searching, read the canonical sources:

- [`../../../CLAUDE.md`](../../../CLAUDE.md) for the candidate profile and constraints
- [`../../../.claude/skills/job-scraper/search-queries.md`](../../../.claude/skills/job-scraper/search-queries.md) for thesis timing and screening rules

## Search procedure

1. Open the public job search and run focused searches separately:
   - `Master's thesis worker machine learning`
   - `Master thesis software engineering`
   - `research assistant master thesis AI`
   - `thesis project optimisation`
   - `diplomityö tekoäly`
   - `opinnäytetyö ohjelmistokehitys`
   - `tutkimusapulainen machine learning`
2. Use the visible **Technology**, **Software Development**, **Deep Tech**,
   **Engineering**, **Academics**, and **Interns & summer jobs** categories when useful.
   Prioritise Helsinki, Espoo, Vantaa, Tampere, Oulu, and Turku.
3. Open only results whose title or description explicitly mentions a Master’s thesis,
   thesis worker, thesis project, degree project, `diplomityö`, `opinnäytetyö`, or a
   research-assistant appointment intended to produce a thesis.
4. Follow the visible **Go to job site** link and verify the vacancy on the employer’s
   own careers page. Save and present that direct employer URL, not the Work in Finland
   search URL, whenever possible.
5. Deduplicate viable results against `job_scraper/seen_jobs.json` and
   `job_search_tracker.csv` before presenting them.

## Thesis eligibility gate

Present a role as viable only when the employer page supports all of the following, or
clearly label the missing item as unresolved:

- A degree-integrated, individual Master’s thesis with a defensible technical contribution
- Approximately 22–26 weeks during March–August/September 2027
- An identified company or research supervisor and access to the required data and tools
- Paid employment, stipend, or compensation sufficient to make the placement viable
- English as an accepted working and thesis language
- Eligibility for a student who is not enrolled at a Finnish university
- A legally viable arrangement for an Albanian citizen holding an Italian student residence permit
- Confidentiality and intellectual-property terms compatible with university examination and defence

Reject ordinary internships, summer jobs, doctoral positions, postdoctoral roles, and
graduate jobs unless their posting explicitly permits the required Master’s-thesis project.
Reject roles reserved for students of a named Finnish university unless the employer
confirms external Erasmus Mundus students are eligible. Do not treat the portal’s
international-candidate focus as proof of work authorisation.

## Output

For each viable match, provide title, employer, Finnish city, posting date or deadline,
direct employer URL, source `workinfinland-search`, and a short fit note covering thesis
evidence, language, compensation, timing, university-enrolment eligibility, and work
authorisation. Separate genuine matches from promising roles that still require employer
confirmation.

## Boundaries

- Use low-volume interactive searches only for Andri’s personal thesis search.
- Never create a profile, submit an application, or contact an employer without the
  user’s explicit confirmation at the point of action.
- Verify that every result remains open on the original employer page before tracking it
  or preparing application documents.

