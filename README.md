# AURELIA — Haute Joaillerie

The AURELIA fine-jewellery one-pager (hero film, explore row, The Collection bento,
3D-style configurator, heritage, voices, inner circle) as a Vite + React 18 project.
This is the source project for the site live at https://ashfanansari.github.io/aurelia/.

## Develop & build

```bash
npm install     # once
npm run dev     # local dev server
npm run build   # production build into dist/
npm run preview # preview the production build
```

Media (films and photography) lives in `public/` and is served as real files —
`public/hero.mp4`, `public/ring.mp4`, images under `public/img/` — referenced via
the `/aurelia/` base path.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`: it installs dependencies,
builds with Vite, and deploys `dist/` to GitHub Pages via the official Pages actions.
