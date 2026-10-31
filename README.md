# Math Prep

A personal resource guide from arithmetic to precalculus, with aerospace and robotics as the long-term context.

**Live:** https://www.christrovato.com/math_prep

## What is included

- Six connected learning stages, including geometry alongside algebra.
- A searchable, filterable library of 22 books, courses, practice sites, videos and tools.
- A small recommended free stack, with paid alternatives clearly separated.
- Reading, practice, feedback and review strategies, plus contextual notes on popular Math Sorcerer videos.
- 24 original problems with answer checking, hints, worked explanations and common mistakes.
- An interactive line graph and explanations connecting foundations to future engineering mathematics.
- Browser-local bookmarks, self-checks and practice history, with a JSON export.
- Direct research sources and explicit distinctions between recommendations, evidence and official college placement.

## Local use

Requires Node.js 20 or later. No installation or build step is needed.

```sh
npm test
npm run check
node serve.mjs
```

Open http://127.0.0.1:4319/math_prep. The local-only `/__mobile` route provides a 390-pixel iframe for responsive inspection.

## Hosting

The standalone assets are under `dist/math_prep/`. On the existing christrovato.com Next.js site, copy that directory into `public/math_prep/` and add one rewrite:

```js
{ source: '/math_prep', destination: '/math_prep/index.html' }
```

This repository is scoped to the Math Prep deliverable. The parent website and unrelated routes are maintained separately. Preserve the current parent website source when publishing this addition.

## Data and limits

This site has no backend or account. Saved state is local to the browser. External fonts load from Google Fonts with system-font fallbacks. Resource descriptions are original editorial summaries; no textbooks or private transcripts are bundled. Third-party resources and prices were checked in October 2026. The practice bank supplements a full course and does not provide official placement, credit, or a validated mastery assessment.
