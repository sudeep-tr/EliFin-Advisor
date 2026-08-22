# EliFin — client/

This is a complete, ready-to-run Next.js frontend matching the EliFin build guide.

## Setup

1. `npm install`
2. Copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_API_URL` to your backend's URL.
3. `npm run dev` — should start on http://localhost:3000 showing a Next.js banner (not Vite).

## Testing without a backend

`lib/mock-api.ts` is a drop-in fake version of `lib/api.ts` that returns hardcoded data for
every endpoint, so you can click through the whole UI with no backend running. To use it,
rename `lib/api.ts` to something else temporarily and rename `lib/mock-api.ts` to `lib/api.ts`
(or just copy its contents over). Swap back once your real backend is ready.

To get past the login-redirect on protected pages while using the mock, run this in your
browser's DevTools console:

    document.cookie = "token=fake"

## Notes

- `components/ui/` contains small hand-written Button/Input/Card components styled to match
  shadcn's look, so this runs with zero extra setup. If you'd rather use real shadcn/ui,
  delete these three files and run:
  `npx shadcn@latest init` then `npx shadcn@latest add button input card`
  — the rest of the code imports from the same paths either way, so nothing else needs to change.
- No `mongodb` package here on purpose — that belongs only in your backend (`server/`), never
  in frontend dependencies.
