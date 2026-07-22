# Jianwen Xu — Personal Homepage

Personal homepage for Jianwen Xu, a Web Developer / Frontend Engineer.  
Built with vanilla HTML/CSS/JS and hosted on [GitHub Pages](https://jianwen-xu.github.io/homepage/).

## Tech Stack

- **Design**: Custom CSS with 5‑theme system via CSS custom properties
- **Icons**: [Font Awesome](https://fontawesome.com/) (CDN)
- **Fonts**: Outfit, Inter, Figtree, JetBrains Mono (Google Fonts)
- **Aurora**: [Aurora Borealis](aurora-borealis/) — self-contained component library
- **No build step** — pure static files

## Features

- **5‑theme switcher** — Aurora, Monochrome, Warm, Matrix, Glass; persisted to `localStorage`
- **Hero theme previews** — clickable poker‑fan card thumbnails with frosted‑glass backdrop
- **Aurora hero** — animated northern lights with SVG feTurbulence filter and `mix-blend-mode: color-dodge`
- **Stars** — 80 randomly positioned twinkling stars
- **Screensaver mode** — fullscreen toggle that hides UI, shows only animated background
- **Auto-shuffle** — randomly cycles aurora shapes every 8-14s with 3 fade transition modes
- **Responsive** — mobile nav with hamburger toggle, fluid grids
- **Accessible** — skip-link, ARIA labels, `prefers-reduced-motion` support

## Structure

```
├── index.html                 # Main page
├── aurora-borealis/           # Standalone aurora component library
│   ├── aurora-borealis.js     #   UMD library (zero dependencies)
│   ├── aurora-borealis.css    #   External stylesheet
│   ├── index.html             #   Demo page
│   └── package.json
├── assets/
│   ├── style.css              # Page styles (~1300 lines, 5 theme token blocks)
│   ├── script.js              # Theme switcher, nav, scroll, AuroraBorealis init
│   ├── profile.png            # Profile photo
│   ├── favicon.svg            # JX monogram favicon
│   ├── theme-*-thumb.png      # Compressed theme preview thumbnails (140×73)
│   └── theme-*.png            # Full-size theme screenshots
├── README.md
├── LICENSE
└── .gitignore
```

## Themes

| Theme | Description |
|-------|-------------|
| Aurora (default) | Teal + navy, animated aurora hero |
| Monochrome | Grayscale, Inter, minimal |
| Warm | Beige + terracotta, Figtree |
| Matrix | Dark + green, JetBrains Mono |
| Glass | iOS frosted, Inter, Apple blue |

Switch via the palette icon in the nav bar or the card previews in the hero section.

## Development

Open `index.html` in a browser — no server required.  
The page is deployed via GitHub Pages from the `main` branch.

## Aurora Borealis Library

The [`aurora-borealis/`](aurora-borealis/) directory is a standalone component library.  
Use it in any webpage:

```html
<div id="aurora" style="width:100vw;height:100vh"></div>
<script src="aurora-borealis/aurora-borealis.js"></script>
<script>
  new AuroraBorealis('#aurora', {
    bands: 1,
    autoShuffle: true,
    controls: ['fullscreen', 'shuffle', 'auto']
  });
</script>
```

See the [demo page](aurora-borealis/index.html) for more.

## License

MIT
