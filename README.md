# Research Lab Website

A lab website (Home, News, Research/Funding, Member, Publications, Contact) with a hidden
admin dashboard that manages every piece of content on the public site.

- `src/` — React + Vite frontend
- `server/` — Node/Express + JSON-file backend API

## Running locally

Two servers need to run at the same time.

**Backend (API on http://localhost:4000):**

```bash
cd server
npm install   # first time only
npm run dev
```

**Frontend (site on http://localhost:5173):**

```bash
npm install   # first time only
npm run dev
```

Then open http://localhost:5173.

## Admin dashboard

The dashboard has **no visible link anywhere on the public site**. To reach it:

1. Press **Ctrl+A** on any page (ignored while typing in a text field).
2. Sign in with the credentials in `server/.env` — default `admin` / `changeme123`.
   **Change these before deploying.**

The dashboard manages:

| Section        | Controls                                                              |
| -------------- | --------------------------------------------------------------------- |
| Members        | Group leader, alumni and visiting member profiles, with photo upload   |
| News           | Posts on the News page and the home page, each with an optional image  |
| Research Areas | Cards on the Research page and the home page highlights                |
| Funding        | Entries on the Research → Funding page                                 |
| Publications   | International conference, domestic conference and patent entries       |
| Site Settings  | Lab name, tagline, about text, contact details, and the two home page images (banner + about section) |

All changes are saved to `server/data/db.json` and appear on the public site immediately —
no code editing and no redeploy needed.

Note that hiding the link is convenience, not security: the dashboard is still protected by
the login above, so the password is what actually keeps it private.

## Published demo (GitHub Pages)

Pushing to `main` deploys the site to GitHub Pages, where it runs as a **demo**:
there is no backend, so the database is baked into the build and each visitor gets
their own editable copy in their browser.

- Visitors can open the dashboard (Ctrl+A) and sign in with `admin` / `demo123`
  — separate from the real password, and only valid in the demo.
- Their edits are saved to their own browser storage. They never reach other
  visitors, and they never change the published content.
- A banner explains this and offers a "Reset demo" button that restores the
  original content.

To change what the demo starts from, edit content in the local dashboard and push:
`server/data/db.json` and `server/uploads/` are what get baked into the build.

To publish the site without the demo dashboard, remove the `/login` and
`/dashboard` routes from `src/App.jsx` for demo builds.

## Configuration

- `.env` (frontend) — `VITE_API_URL` points the frontend at the backend API.
- `server/.env` (backend) — `PORT`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`.
  Copy `server/.env.example` if `server/.env` is missing.

Uploaded member photos are stored in `server/uploads/`.
