# FaceTrust AI – Real-time Face Verification (MVP)

A sleek, mobile‑first web app that demonstrates core identity verification flows:
- Webcam face capture
- Liveness indicator (mocked)
- AI face matching (mocked)
- Open‑web OSINT preview (mocked reverse image search + socials)
- Local verification logs for audit trail

## Tech Stack
- Vite + React + TypeScript
- Tailwind CSS + shadcn-ui components

## Getting Started
```bash
npm i
npm run dev
```
Visit http://localhost:5173

## Core Flows
- Home: overview of features and AI branches powering the system
- Verify: capture face → run mocked verification → view results & logs
- Login: placeholder for future Supabase Auth

## Deployment
Deploy to any static hosting (e.g., Vercel). Build with:
```bash
npm run build
```
Output is in dist/.

## Notes
- All AI is mocked for demo. Replace services in src/services/* with real providers (Azure Face API, DeepFace, etc.).
- OSINT module is illustrative only and does not scrape the web.


