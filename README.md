# SiteRun

A personal hobby project I built and finished: a mobile-first web app for plumbers and contractors who need building materials delivered to active job sites.

**Not affiliated with any company.** SiteRun is a fictional product name and UI concept I explored for fun — inspired by quick-commerce patterns in India, but entirely my own design and code.

## Why I built it

On renovation sites, a lot of time disappears into hardware runs and waiting for the right fittings. I wanted to see if a simple “job → checklist → order → track delivery” loop could feel natural on a phone, in both English and Hindi.

## What it does

- **Jobs at delivery sites** — multiple open jobs, each with a material checklist tied to job type (bathroom, kitchen, PVC repair, etc.)
- **Catalog + job kits** — SKUs mapped to realistic plumbing work, not generic lists
- **Order co-pilot** — type or speak orders; parses Hindi/English and adds to cart
- **Checklist gaps** — order only what’s still missing vs what’s already in the cart
- **Delivery tracking** — live ETA, add more materials to the same job mid-flight
- **Ops view (demo)** — multi-order pick queue with SLA and per-order pick state

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4 — no backend; state lives in React context for prototyping.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

**Demo login:** phone `9876543210` → OTP `123456`

## Status

Feature-complete for the scope I set myself (v3). I’m not actively extending it unless something interesting comes up.

## License

MIT — use the code as you like; please don’t imply endorsement by any real-world brand.
