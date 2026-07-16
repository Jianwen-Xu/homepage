# Jianwen Xu — Personal Homepage

Personal homepage for Jianwen Xu, a Web Developer / Frontend Engineer.  
Built with vanilla HTML/CSS/JS and hosted on [GitHub Pages](https://jianwen-xu.github.io/homepage/).

## Tech Stack

- **Framework**: [Vanilla Framework](https://vanillaframework.io/) (CDN)
- **Icons**: [Font Awesome](https://fontawesome.com/) (CDN)
- **Animation**: Custom SVG feTurbulence filter + CSS `@keyframes` drift
- **No build step** — pure static files

## Features

- **Aurora hero** — 3-band northern lights animation with SVG noise filter, `mix-blend-mode: color-dodge`, and GPU-composited CSS drift
- **Stars** — 80 randomly positioned twinkling stars, JS-generated
- **Mountains** — 3-layer cubic bezier SVG silhouettes
- **Screensaver mode** — fullscreen toggle that hides UI, showing only the animated background
- **Responsive** — mobile nav toggle, Vanilla Framework grid
- **Accessible** — skip-link, ARIA labels, `prefers-reduced-motion` support

## Structure

```
├── index.html          # Main page
├── assets/
│   ├── style.css       # All styles
│   ├── script.js       # Nav, stars, screensaver, aurora turbulence
│   ├── profile.png     # Profile photo
│   └── favicon.svg     # JX monogram favicon
├── README.md
└── .gitignore
```

## Development

Open `index.html` in a browser — no server required.  
The page is deployed via GitHub Pages from the `main` branch.

## License

MIT
