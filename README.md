# TinyLink

**TinyLink** — a lightweight TinyURL-style link shortener built with Node.js, Express, and MongoDB. Includes a simple dashboard to create, manage, and track shortened links.

---

## Short description

A minimal URL shortener with custom codes, click tracking, and a clean dashboard UI. Perfect as a demo project for backend API design and full-stack basics.

---

## Features

* Shorten URLs with random or custom 6–8 character codes.
* Click tracking (click count, last clicked timestamp).
* Dashboard to create, view, search, copy, and delete links.
* Stats page per code showing basic analytics.

---

## Tech stack

* **Backend:** Node.js + Express. See `server.js` (/mnt/data/server.js)
* **Database:** MongoDB (via Mongoose)
* **Frontend:** Static HTML/CSS/vanilla JS in `public/` (dashboard + stats)
* **Validation:** `valid-url` package

---

## Repo structure

```
tinyurl/
├─ server.js                      # Express app entrypoint (/mnt/data/server.js)
├─ package.json                   # npm scripts & dependencies (/mnt/data/package.json)
├─ package-lock.json              # lockfile (/mnt/data/package-lock.json)
├─ models/
│  └─ Link.js                     # Mongoose schema (/mnt/data/Link.js)
├─ routes/
│  └─ links.js                    # API routes (/mnt/data/links.js)
├─ public/
│  ├─ index.html                  # Dashboard UI (/mnt/data/index.html)
│  ├─ stats.html                  # Stats page (/mnt/data/stats.html)
│  ├─ styles.css                  # Styles (/mnt/data/styles.css)
│  └─ js/
│     ├─ dashboard.js             # Dashboard frontend logic (/mnt/data/dashboard.js)
│     └─ stats.js                 # Stats page frontend (/mnt/data/stats.js)
```

---

## Getting started (local)

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with the following variable:

```
MONGO_URI=<your_mongodb_connection_string>
PORT=3000
```

3. Start the server (development):

```bash
npm run dev
# or
npm start
```

4. Open the dashboard in your browser:

```
http://localhost:3000/
```

> The server serves static frontend files from the `public/` folder and exposes the API under `/api/links`.

---

## API Endpoints

* `POST /api/links` — Create a new short link

  * Body: `{ targetUrl: string, code?: string }` (code optional; must match `[A-Za-z0-9]{6,8}` if provided)
  * Example implementation: routes/links.js (/mnt/data/links.js)

* `GET /api/links` — List all links

* `GET /api/links/:code` — Get stats for a single link

* `DELETE /api/links/:code` — Delete a link

* `GET /:code` — Redirect to the target URL and increment click stats (implemented in `server.js`).

---

## Notes & tips

* Custom codes must be 6–8 alphanumeric characters; random codes are 6 characters by default.
* Frontend expects the API at the same origin (relative `/api/links`). If you host backend separately, update `API_BASE` in `public/js/dashboard.js` (/mnt/data/dashboard.js).
* The project includes basic input validation using `valid-url` and unique enforcement at the DB level for `code`.

---

## Useful local file links

* `server.js`: /mnt/data/server.js
* `package.json`: /mnt/data/package.json
* `models/Link.js`: /mnt/data/Link.js
* `routes/links.js`: /mnt/data/links.js
* `public/index.html`: /mnt/data/index.html
* `public/js/dashboard.js`: /mnt/data/dashboard.js
* `public/styles.css`: /mnt/data/styles.css


* Generate a short `README` badge section (Build / License)
* Create a `README` with screenshots (I can embed screenshots of `public/index.html`)
* Automatically add a `.gitignore` and `LICENSE` file

Tell me which of the above you want and I’ll update the README.
