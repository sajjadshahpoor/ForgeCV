# ForgeCV

A free, open-source resume builder with AI keyword matching built in — no sign-up, no backend, no tracking. Runs entirely in your browser and deploys as a static site on GitHub Pages.

**[Live demo →](https://sajjadshahpoor.github.io/ForgeCV/)**

## Why

Most "AI resume builder" products put the AI behind a paywall and your data behind an account. ForgeCV does the opposite:

- **Offline AI keyword matching, for free, forever.** Paste a job description and ForgeCV extracts the skills/keywords that matter and checks which ones already appear in your resume — the same ATS signal recruiting software looks for. This runs as a rule-based engine entirely in your browser; no API, no cost, no rate limit.
- **AI writing with zero setup.** Click "Write with AI" and it just works — a small instruction-tuned model ([SmolLM2-360M-Instruct](https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct)) downloads once (~350MB, then cached by the browser) and runs entirely on-device via [transformers.js](https://github.com/huggingface/transformers.js), no key or account required. Bullet rewrites are shown as a suggestion to accept or discard rather than applied silently, and a guard blocks any rewrite that introduces a number that wasn't in the original — small on-device models occasionally do that, and a wrong stat on a resume is worse than no rewrite at all.
- **Optional faster/higher-quality AI.** If you want noticeably better writing quality or don't want to wait on the one-time model download, paste your own free [Google Gemini API key](https://aistudio.google.com/apikey) instead. It's stored only in your browser's `localStorage` and called directly from your browser to Google — it never touches a server of ours, because there isn't one.
- **Your data never leaves your device**, except when you choose to use the optional Gemini upgrade above. Everything else — your resume content, template choice, colors — lives in `localStorage`. Export to PDF or JSON any time.

## Features

- 4 hand-built templates (Modern, Classic, Minimal, Bold) with custom accent colors, font, and text size
- Drag-and-drop section reordering and show/hide per section
- Drag-and-drop experience bullet points with weak-phrasing and missing-metric detection
- Offline ATS keyword match score against any pasted job description
- Zero-setup on-device AI writing (summaries, bullet rewrites, keyword-driven bullet suggestions), with an optional Gemini upgrade
- Shareable resume links — the whole resume is encoded in the URL, no server involved
- 6 sample resumes across different fields to start from
- Photo upload, JSON import/export, autosave to `localStorage`
- One-click PDF export via the browser's native print pipeline

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, dnd-kit, react-to-print, transformers.js. No backend, no database, no build-time secrets.

## Running locally

```bash
npm install
npm run dev
```

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the app and publishes `dist/` to GitHub Pages. Enable Pages in the repo settings with source set to **GitHub Actions**.

The Vite `base` path in [`vite.config.ts`](vite.config.ts) is set to `/ForgeCV/` to match this repo name — update it if you rename or fork the repo.

## License

MIT © Sajjad Shahpoor
