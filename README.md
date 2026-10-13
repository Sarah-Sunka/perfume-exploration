# Épée & Fluide — Parfums de Soi

A small static website for a fictional artisanal perfumery, built from the Stitch export
(`stitch_scent_persona_perfume_discovery.zip`). Four pages, no build step, ready for Vercel.

## Pages

| Page | File | What it does |
|------|------|--------------|
| Home | `index.html` | Hero, fragrance wardrobe with working archetype filters, quiz banner, science, guarantees |
| Scent Quiz | `quiz.html` | 4-question interactive quiz that calculates and shows your fragrance match live |
| About | `about.html` | The atelier story, facts, formulation science, timeline |
| Contact | `contact.html` | Validated contact form, atelier details, FAQ |

## Folder layout

```
├── index.html  quiz.html  about.html  contact.html
├── serve.js             (optional tiny local preview server)
├── assets/
│   ├── css/styles.css   (all design styles)
│   ├── js/main.js       (nav, filters, quiz, forms)
│   └── img/             (all images, stored locally)
└── README.md
```

## Preview it locally

**Easiest — just double-click `index.html`.** This site uses plain relative
paths and no build step, so it opens straight from the folder (verified).

**Nicer — with a local server** (live reload, cleaner URLs). Pick one:

**Option A — the bundled server (needs Node.js installed):**

```bash
node serve.js
```

then open http://localhost:8123

**Option B — VS Code / Qoder "Live Server" extension:** right-click `index.html`
→ "Open with Live Server".

Use the browser's device toolbar (F12 → phone icon) to test the mobile layout.

## Publish on Vercel

1. Push this folder to a GitHub/GitLab/Bitbucket repository.
2. On [vercel.com](https://vercel.com), choose **Add New → Project** and import the repo.
3. Vercel detects a static site automatically — no framework, no build command, no settings needed.
4. Click **Deploy**. Your site is live in under a minute.

## Notes

- No frameworks, no build step, no `node_modules` — plain HTML, CSS and JavaScript.
- All images are stored locally in `assets/img/` (nothing hotlinks to temporary URLs).
- The contact form validates in the browser and shows a confirmation. To receive real
  email, connect a form service such as Formspree (point the `<form action=...>` at your endpoint).
