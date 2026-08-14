# Content updates

How to add records without inventing jobs, certificates, or outcomes.

## Add a certificate

1. Append an object to [`src/assets/myCertificates.json`](src/assets/myCertificates.json).
2. Required fields: `id`, `name`, `issuer`, `issueDate` (`YYYY-MM-DD`), `category`.
3. Keep `category` as a stored string. Do not recategorize old records.
4. Optional: `credentialUrl`, `description`, `skills`, `featured`.
5. To pin homepage preview cards, add the `id` to `featuredCertificateIds` in [`src/content/certificateModel.ts`](src/content/certificateModel.ts). Leave that array empty to show newest certificates.
6. Do not add a proficiency `level`. The UI does not invent Intermediate/Advanced.

## Add a banking or employer role

1. Append an object to [`src/assets/jobExperience.json`](src/assets/jobExperience.json).
2. Required: `title`, `company`, `from` (`MM-YYYY`), `to` (`MM-YYYY` or `"Present"`), `description`.
3. Optional factual fields: `location`, `keyResponsibilities`, `achievements`, `technologies`.
4. For a real bank/fintech job, you may also set on the JSON object (or in `jobEnrichments` in [`src/content/experienceModel.ts`](src/content/experienceModel.ts)):
   - `employmentType`: `full-time` | `contract` | `freelance` | `part-time`
   - `financialDomains`: e.g. `["banking"]`, `["payments"]`
   - `complianceDomains`, `featured`, `id` (stable slug)
5. Do not add a banking role until it is real employment. Overlapping freelance dates are concurrent work, not an error.

## Add a fintech-oriented project

1. Prefer the existing JSON source that matches the work:
   - WordPress/client sites: [`src/assets/myProjects.json`](src/assets/myProjects.json)
   - Client/personal web: [`src/assets/clientProjects.json`](src/assets/clientProjects.json) or [`src/assets/personalProjects.json`](src/assets/personalProjects.json)
   - React showcase: [`src/assets/myReactProjects.json`](src/assets/myReactProjects.json)
2. Taxonomy (`ownership`, `domain`, `workType`, `engineering`) is derived in [`src/content/projectTaxonomy.ts`](src/content/projectTaxonomy.ts). Set `category: "Fintech"` on a web project when that is factual.
3. For a case study, add an object to `featuredCaseStudies` in [`src/content/caseStudies.ts`](src/content/caseStudies.ts) and a matching prerender route in [`src/config/routeMeta.js`](src/config/routeMeta.js). Skip empty template fields. Do not invent outcomes, investment performance, or client counts.

## Identity counts

Career claims (`18+` / `390+` / `172+`) live in [`src/config/site.ts`](src/config/site.ts). Do not mix them with archive lengths (WordPress JSON count, schema subset, or project blurbs).

## Remaining confirmations

These still need a human check before calling the public site finished:

- **Stoney Holiday Lets screenshot.** Add [`public/images/projects/stoneyholidaylets.webp`](public/images/projects/stoneyholidaylets.webp). The case study already points at that path and stays text-first until the file exists. Do not invent or download a stand-in.
- **MTX Clinic App.** Keep screens and the live URL private until a public URL is explicitly allowed.
- **LinkedIn.** Align the public headline with Senior Full-Stack Engineer and the career counts in `src/config/site.ts`. Do not invent banking roles there.
- **CV.** The PDF at [`public/cv/Theodoros-Mentis-CV.pdf`](public/cv/Theodoros-Mentis-CV.pdf) could not be text-extracted during the identity baseline. Re-read titles, dates, and the fintech line against the live site before publishing.
