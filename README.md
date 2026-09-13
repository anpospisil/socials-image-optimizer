# Socials Optimizer

A full-stack image optimization tool that resizes and formats images for social media platforms in one pass. Built as a portfolio project to demonstrate production-grade frontend architecture, analytics implementation, and cross-service system design.

**Live demo:** https://socials-image-optimizer.vercel.app  
**API:** https://image-optimizer-api-0r7m.onrender.com/docs

---

## What it does

Upload an image once and generate platform-optimized outputs for Bluesky, Twitter/X, Instagram and Facebook simultaneously — correct dimensions, aspect ratios, and file sizes per platform. Optional watermarking and content safety filtering (configurable sensitivity, blur/redaction modes) included.

---

## Architecture

Two independently deployed services sharing a typed contract. The Next.js frontend (Vercel) communicates via HTTP multipart with the FastAPI image processing service (Render).

The backend wraps a Python image processing pipeline (PIL, OpenCV) behind a REST API rather than rewriting it in Node. This decision is documented in [ADR #1](docs/decisions/ADR-001-fastapi-wrapper.md) — rewriting correct, working code introduces risk with no functional gain.

The frontend is a Next.js App Router application with all state and API logic centralised in a custom hook (`useProcessor`), keeping components as pure presentational units. This makes the analytics layer and business logic independently testable.

---

## Tech stack

**Frontend**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Google Tag Manager + GA4 (typed event schema)
- Jest + React Testing Library

**Backend**
- FastAPI (Python)
- PIL / Pillow for image processing
- OpenCV for image manipulation
- dghs-imgutils for image classification
- Deployed on Render via Dockerfile

---

## Analytics implementation

One of the intentional focuses of this project is a production-grade GTM + GA4 implementation. Rather than scattering `gtag()` calls through components, all events flow through a typed event schema and a centralised `useAnalytics` hook.

This creates a typed contract between the frontend and GTM, makes events testable in isolation, and mirrors how analytics is managed in production MarTech environments. See `src/lib/analytics.ts` and `src/hooks/useAnalytics.ts`.

---

## Testing

Run the test suite with `npm test`. Three suites cover the areas most likely to regress silently:

- **analytics.test.ts** — verifies the dataLayer contract: event shape, GTM event key, SSR safety
- **presets.test.ts** — validates all platform presets have positive dimensions and labels
- **useProcessor.test.ts** — tests hook state transitions: file selection, platform toggling, reset, error handling

Testing analytics events specifically is an intentional choice — these are the failures that are hardest to catch manually and most damaging in production.

---

## Architecture decisions

All significant technical decisions are documented as Architecture Decision Records:

- [ADR #1 — FastAPI wrapper over Node rewrite](docs/decisions/ADR-001-fastapi-wrapper.md)
- [ADR #2 — Next.js App Router over Pages Router](docs/decisions/ADR-002-app-router.md)
- [ADR #3 — Typed platform preset schema](docs/decisions/ADR-003-platform-preset-schema.md)
- [ADR #4 — Centralised analytics hook](docs/decisions/ADR-004-analytics-architecture.md)
- [ADR #5 — Testing strategy](docs/decisions/ADR-005-testing-strategy.md)

---

## Local development

Prerequisites: Node 18+, Python 3.12

Frontend:

    cd socials-optimizer
    cp .env.local.example .env.local
    npm install
    npm run dev

Backend (separate terminal):

    cd image-optimizer-api
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    uvicorn app.main:app --reload

---

## Project status

- ✅ Phase 1 — FastAPI service + Next.js scaffold
- ✅ Phase 2 — Platform presets, content safety filtering, detection preview
- ✅ Phase 3 — GTM + GA4 analytics layer
- ✅ Phase 4 — Jest unit tests
- 🔄 Phase 5 — Playwright E2E tests + Lighthouse CI
- 🔄 Phase 6 — ADRs
