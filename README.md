# Math Prep — The Engineering Learning Platform

A static learning and resource site for arithmetic through precalculus, connecting mathematical ideas to their history and future use in aerospace and robotics.

**Production route:** https://www.christrovato.com/math_prep

## What is included

The v3 platform has 24 primary sections, plus individual lesson pages and a global search. A NASA Cupola photograph anchors the redesigned homepage; the reader, curriculum index, practice workshop, engineering map, and progress dashboard each have a distinct layout.

- 48 original lessons, eight per stage, with 52 worked examples, 48 explanation-based quizzes, prerequisites, and engineering connections. More than 17,000 words of curriculum, with 70 official OpenStax references.
- 36 generated practice skills with deterministic variations, hints, worked solutions, saved sessions, and separate independent/assisted first-attempt records. Review suggestions use transparent 1/3/7/14-day intervals; these are editorial heuristics, not a validated mastery model.
- 24 substantial study guides about meaning, learning, practice, and sustainable effort; 12 engineering habits; and 12 low-cost projects with explicit assumptions, checks, and deliverables. More than 14,000 words of additional field-manual material.
- Six capability maps connecting foundations to robotics, orbital motion, power, structures, habitats, and aerodynamics.
- Global search across 202 content entries, adjustable reading text, printable articles, manual read markers, and a local progress dashboard.

- Six learning stages, with geometry alongside algebra and a distinction between starting precalculus and being ready for calculus.
- 16 sourced historical stories, 24 concept explanations, 8 worked aerospace/robotics missions, 10 common mistakes, and 30 glossary terms.
- Five interactive labs covering power and energy, linear functions, scaling, vectors, and circular orbits. Models state their assumptions.
- A 12- or 24-question informal diagnostic with separate responses for skipped and not-yet-learned topics, topic feedback, and starting recommendations.
- 24 original practice problems with answer checking, hints, and worked explanations.
- A searchable library of 22 resources, a recommended free stack, paid alternatives, and study guidance contextualizing Math Sorcerer videos.
- Browser-local bookmarks, self-checks, practice history, diagnostic progress, and personal notes, with versioned JSON export and import. Existing progress is preserved through the same `math-prep-v1` storage key. Imports validate and merge records without summing duplicate practice counters; newer activity records replace older ones for the same skill or lesson.

## Local use

Requires Node.js 20 or later. No installation or build step is needed.

```sh
npm test
npm run check
node serve.mjs
```

Open http://127.0.0.1:4319/math_prep. The local-only `/__mobile` route provides a 390-pixel iframe for responsive inspection.

## Source layout

- `app.js`, `expansion.js`, `platform.js`: routing, readers, resource filters, search, and dashboards.
- `data.js`, `concepts-data.js`, `history-data.js`, `curriculum-data.js`, `field-manual-data.js`, `platform-data.js`: original content and direct sources.
- `problems.js`, `diagnostic.js`, `labs.js`, `drill-engine.js`, `drills.js`: practice grading, informal assessment, interactive models, and generated practice.
- `workspace.js`: legacy migration, bounded input normalization, portable backup, and atomic merge.
- `styles.css`, `atlas.css`, `platform.css`, `index.html`: responsive presentation and application shell.
- `tests/`: independent calculations, answer handling, diagnostic behavior, source/schema integrity, practice-state transitions, readers, search, and backup regression tests.

Application files are under `dist/math_prep/`. Content and examples are authored locally; the browser does not call an AI service.

## Hosting

The standalone assets are under `dist/math_prep/`. On the existing christrovato.com Next.js site, copy that directory into `public/math_prep/` and add one rewrite:

```js
{ source: '/math_prep', destination: '/math_prep/index.html' }
```

This repository is scoped to the Math Prep deliverable. The parent website and unrelated routes are maintained separately. Preserve the current parent website source when publishing this addition.

## Data and limits

This site has no backend or account. Saved state is local to the current browser and origin; export it for a portable record. External fonts load from Google Fonts with system-font fallbacks. Resource descriptions, teaching examples, and questions are original summaries and exercises; no textbooks or private transcripts are bundled. Historical stories distinguish modern illustrations from historical evidence, and hypothetical engineering examples are not design specifications.

Backups may contain personal notes. The supported notebook limit is 2,000 notes (5,000 characters each); imports over 50 MB or above supported record limits are rejected. Over-limit merges leave the existing workspace unchanged. Clearing browser data without a backup loses local records. Practice progress is evidence of activity, not college credit or a professional qualification.

The hero image is a 256 KB optimized WebP derived from NASA's [ISS Cupola image collection](https://svs.gsfc.nasa.gov/webapps/planet-pen/Images/Cupola/), credited on the site. NASA does not endorse this project.

Third-party resources and prices were reviewed in October 2026. The practice bank and diagnostic supplement a full course. They do not provide official college placement, credit, a percentile, or a validated mastery assessment. Readiness thresholds and study recommendations are editorial guidance.
