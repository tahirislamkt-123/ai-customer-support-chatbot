# Milestone 3 — Next.js AI Chat UI

This directory contains **replacement files** for a Next.js App Router frontend created using `create-next-app`. It is not a standalone Node.js package.

## Set up

From your existing Git repository root:

```bash
npx create-next-app@latest frontend --ts --tailwind --eslint --app --no-src-dir --use-npm --import-alias "@/*"
```

Copy this package's `app/` files into `frontend/app/` (replace `page.tsx`, `layout.tsx`, `globals.css`; add `api/chat/route.ts`). Copy `.env.local.example` into `frontend/`, rename it `.env.local`, and retain `FASTAPI_URL=http://127.0.0.1:8000` for local development.

From repository root, run backend:

```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

In a second terminal:

```bash
cd frontend
npm run dev
```

Open http://localhost:3000.

## API design

Browser -> POST `/api/chat` (Next.js Route Handler) -> POST `http://127.0.0.1:8000/chat` (FastAPI) -> Qwen.
The frontend displays message history but the Milestone 2 FastAPI API accepts only `message`, so this demo has **no actual multi-turn model memory yet**. This will be implemented in the next milestone.

## Safety notes

- Demo only. No authentication, rate limiting, persistence, or independent moderation.
- Do not deploy this public without appropriate access controls and operational safeguards.
- Backend URL is server-only; do not prefix it with NEXT_PUBLIC_.
- Error responses deliberately avoid leaking backend stack traces.
- The Next.js server and FastAPI must both be running and network-reachable from each other.

## Verification

1. Backend: visit `http://127.0.0.1:8000/health`.
2. UI: visit `http://localhost:3000`.
3. Ask `What is an LLM?` and verify an AI response arrives.
4. Stop FastAPI and verify the UI displays a friendly connection error.
5. Run `npm run lint` and `npm run build` before committing.
