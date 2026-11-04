# Jianwen Xu — Personal Site

Personal site for Jianwen Xu, a full-stack software engineer in Oulu, Finland.
Built with vanilla HTML/CSS/JS and hosted on [GitHub Pages](https://jianwen-xu.github.io/homepage/).

## What it is

A hiring page, not a portfolio gallery. The order is deliberate:

1. **Hero** — role, one-line proof, availability, CV and email.
2. **Selected work** — three production cases: data reconciliation, frontend from zero, manual reporting replaced.
3. **Experience** — four roles, outcome-first, with the stack for each.
4. **Projects** — `shsf`, Terraform IaC, `deep-demo`, `zodcat`.
5. **How I work** — verification, review standard, observability.
6. **About** — location, work authorization, languages, education.
7. **Contact** — email, phone, GitHub, LinkedIn, CV.

The detailed reconciliation case study is kept private (`.private/`) because it
describes integration architecture and client systems. Ask for it in an interview
rather than publishing it.

## Structure

```
├── index.html                    # Main page
├── cv.html                       # CV source (print styles, A4)
├── assets/
│   ├── style.css                 # Base styles + 5 theme token blocks
│   ├── site.css                  # Layout refresh, diagram, case study, print
│   ├── script.js                 # Theme switcher, nav, scroll reveal
│   ├── Jianwen_Xu_CV.pdf         # Generated from cv.html
│   ├── og.png                    # 1200×630 social card
│   ├── profile.webp
│   └── theme-*-thumb.png         # Theme previews
└── README.md
```

## Aurora theme

The aurora-theme hero uses a real time-lapse clip rather than a shader: two
stacked `<video>` elements crossfade at the loop point, muted and `playsinline`,
loaded only when the aurora theme is active. A poster frame covers
`prefers-reduced-motion` and the gap before playback.

## Assets and licenses

- **Aurora footage**: "Aurora borealis timelapse" from
  [Mixkit](https://mixkit.co/free-stock-video/aurora-borealis-timelapse-4033/),
  free license, no attribution required. `assets/aurora.mp4` (720p, 3.7 MB) and
  `assets/aurora-poster.jpg`.
- **Type**: Inter, JetBrains Mono, Outfit, Figtree via Google Fonts.
- **Icons**: inline SVG.
- **CV**: generated from `cv.html` with Playwright.

## Themes

Five token sets, switched from the palette button and persisted to `localStorage`:
Aurora, Mono (default), Warm, Matrix, Glass. The page is designed in Mono first;
the others are palette swaps, not separate layouts.

## Local development

Open `index.html` in a browser. No build step, no server required.

Regenerate the CV PDF after editing `cv.html` with Playwright
(`preferCSSPageSize: true`, A4). The generated file is committed so the site can
link to it directly.

## Notes

- Content is intentionally in English (Finnish job market).
- The site is fully static. The only external request is Google Fonts, used by the
  theme token system; it can be self-hosted if that matters.
- Social metadata (`og:*`, Twitter card, JSON-LD `Person`) is set for link previews.
- Reduced motion, print, and no-JS states are handled: reveal animations only run
  when a `js` class is present on `<html>`.
