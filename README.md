# Math Prep — Mathematics Field Atlas

A static learning and resource site for arithmetic through precalculus, connecting mathematical ideas to their history and future use in aerospace and robotics.

**Production route:** https://www.christrovato.com/math_prep

## What is included

The v2 atlas has 15 sections: overview, learning path, placement check, concept atlas, history, glossary, learning method, aerospace examples, interactive labs, practice, mistake lab, resource library, workspace, future mathematics, and research sources.

- Six learning stages, with geometry alongside algebra and a distinction between starting precalculus and being ready for calculus.
- 16 sourced historical stories, 24 concept explanations, 8 worked aerospace/robotics missions, 10 common mistakes, and 30 glossary terms.
- Five interactive labs covering power and energy, linear functions, scaling, vectors, and circular orbits. Models state their assumptions.
- A 12- or 24-question informal diagnostic with separate responses for skipped and not-yet-learned topics, topic feedback, and starting recommendations.
- 24 original practice problems with answer checking, hints, and worked explanations.
- A searchable library of 22 resources, a recommended free stack, paid alternatives, and study guidance contextualizing Math Sorcerer videos.
- Browser-local bookmarks, self-checks, practice history, diagnostic progress, and personal notes, with JSON export. Existing progress is preserved through the same `math-prep-v1` storage key.

## Local use

Requires Node.js 20 or later. No installation or build step is needed.

```sh
npm test
npm run check
node serve.mjs
```

Open http://127.0.0.1:4319/math_prep. The local-only `/__mobile` route provides a 390-pixel iframe for responsive inspection.

## Source layout

- `app.js`, `expansion.js`: routing, page rendering, resource filters, glossary, and workspace.
- `data.js`, `concepts-data.js`, `history-data.js`: curated learning content and direct sources.
- `problems.js`, `diagnostic.js`, `labs.js`: practice grading, informal assessment, and interactive models.
- `styles.css`, `atlas.css`, `index.html`: presentation and the application shell.
- `tests/`: Node tests for mathematical calculations, answer handling, diagnostic behavior, and lab models.

Application files are under `dist/math_prep/`. Content and examples are authored locally; the browser does not call an AI service.

## Hosting

The standalone assets are under `dist/math_prep/`. On the existing christrovato.com Next.js site, copy that directory into `public/math_prep/` and add one rewrite:

```js
{ source: '/math_prep', destination: '/math_prep/index.html' }
```

This repository is scoped to the Math Prep deliverable. The parent website and unrelated routes are maintained separately. Preserve the current parent website source when publishing this addition.

## Data and limits

This site has no backend or account. Saved state is local to the current browser and origin; export it for a portable record. External fonts load from Google Fonts with system-font fallbacks. Resource descriptions, teaching examples, and questions are original summaries and exercises; no textbooks or private transcripts are bundled. Historical stories distinguish modern illustrations from historical evidence, and hypothetical engineering examples are not design specifications.

Third-party resources and prices were reviewed in October 2026. The practice bank and diagnostic supplement a full course. They do not provide official college placement, credit, a percentile, or a validated mastery assessment. Readiness thresholds and study recommendations are editorial guidance.
