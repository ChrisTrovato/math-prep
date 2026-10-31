# Work log

## 2026-10-31 — Math Prep resource guide

Built the arithmetic-to-precalculus guide for `christrovato.com/math_prep`.

- Curated 22 resources with stage, format, price category, recommended role, usage advice and limitations.
- Added six connected stages, including geometry alongside algebra and a clear distinction between beginning precalculus and being calculus-ready.
- Explained the study loop and contextualized five popular Math Sorcerer videos.
- Added an interactive line graph, 24 original problems with hints and explanations, bookmarks, self-checks and local data export.
- Linked evidence, publisher pages, providers and Southwestern's official placement guidance.
- Reviewed scope to keep this repository limited to the public Math Prep deliverable.

Validation: independent answer calculations, fraction parsing, rounding tolerance, negative-number handling, malformed-input rejection, and content/reference checks passed. Desktop and 390-pixel mobile layouts were visually reviewed in Chrome; correct-answer feedback, fractional input, resource search and bookmarks were exercised. The site remains a supplement to a complete course and does not provide official placement.

Publication uses the existing christrovato Vercel project, preserving the parent site's other routes. Release identifiers are recorded in `DEPLOYMENT.json` once production verification completes.

## 2026-10-31 — v2 Mathematics Field Atlas

Expanded the guide into 15 sections with a new visual presentation and deeper explanations connecting foundations to engineering.

- Added 16 sourced historical stories, 24 concept explanations, 8 worked aerospace/robotics missions, 10 mistake explanations, and a searchable 30-term glossary.
- Added five interactive labs for energy, linear functions, scaling, vectors, and circular orbits, with explicit model assumptions.
- Added a 12- or 24-question informal diagnostic that distinguishes wrong answers, skipped questions, and not-yet-learned topics, then recommends starting topics without claiming official placement.
- Retained the six-stage path, 24 practice problems, and 22-resource library; added browser-local notes and expanded JSON export while preserving existing progress through the original storage key.
- Audited content and source links, including historical caveats, engineering assumptions, and worked arithmetic.

Validation at this checkpoint: 23 automated tests pass. Desktop and mobile browser QA is underway; final production deployment and release verification are not yet recorded for this expansion.

### V2 release verification

- Production build passed; all 11 live assets match tested source hashes.
- All 15 sections checked at phone width without horizontal overflow.
- Diagnostic answer/save/reload/results, notebook persistence and safe text, glossary search, concept-to-note links, practice grading, and five lab panels checked in Chrome.
- 23 automated tests and content integrity checks pass.
- Preserved 96 unrelated parent files; existing homepage, aerospace guide, Godel page, and opportunity page return HTTP 200.
- Live release and source commit are recorded in DEPLOYMENT.json.



## 2026-10-31 — v3 Engineering Learning Platform

Expanded the atlas into 24 primary sections with a cinematic NASA Cupola homepage, a guided reader, fresh practice, and a portable workspace.

- Added 48 lessons, 52 worked examples, 48 quizzes, and 70 official OpenStax references; more than 17,000 words of original curriculum.
- Added 24 study guides, 12 engineering habits, 12 projects, and six maps connecting foundations to aerospace capabilities; more than 14,000 words of original field-manual material.
- Added 36 parameterized practice skills, saved sessions, separate independent/assisted first-attempt records, and a transparent review queue.
- Added search across 202 entries, adjustable reading text, print controls, read marks, a progress dashboard, and versioned backup/import.
- Preserved the existing path, diagnostic, history, interactive labs, resources, and browser storage key.
- Independently audited quiz answers and worked examples, corrected trigonometry wording, and verified source links.

Validation: 65 automated tests pass, including independent calculations for 7,200 generated exercises, quiz persistence, backup restoration, duplicate-counter prevention, record-limit rejection, and asynchronous import races. All 24 sections render at desktop and 375-pixel content width without horizontal overflow. Browser checks cover global search, lesson feedback/read marks after reload, fresh practice grading, selector/deep-link resume, and backup preview/merge into the notebook. Long-form reading and mobile homepage layouts were visually inspected. Final release identifiers and verified asset hashes are recorded separately in DEPLOYMENT.json.


### V3 release verification

- Production build passed and the custom domain points to the verified deployment.
- All 20 deployed Math Prep assets, including the NASA image, match tested source hashes.
- Public curriculum/search and the final homepage were checked in Chrome; the bare-domain redirect is valid.
- Larger-text lesson navigation and project details fit the phone viewport after a layout correction.
- Preserved 96 unrelated parent files and verified the homepage, aerospace guide, Godel page, and opportunity page return HTTP 200.
- Synchronized the parent source copy and recorded deployment identifiers, counts, and live hashes in DEPLOYMENT.json.
