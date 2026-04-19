# AGENTS.md

## Commands
```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build   # Typecheck + build (includes TypeScript)
npm run start   # Production server
npm run lint   # ESLint
```

## Tech Stack
- Next.js 16 (app router), React 19, TypeScript 6, Tailwind CSS 4
- Recharts for charts, Lucide icons, date-fns

## API
- Expects backend at `http://localhost:8000`
- Override: set `NEXT_PUBLIC_API_URL` env var

## Build Verification
- Always run `npm run build` before committing—includes type checking

## Key Paths
- Dashboard: `app/dashboard/page.tsx`
- Components: `app/components/charts/`, `app/components/ui/`, `app/components/tables/`
- Types: `types/inventory.ts`
- Mock data: `lib/data.ts`

## Tailwind
- Uses `@tailwindcss/postcss` v4 (no traditional tailwind.config.js customization needed for most work)
- Custom theme in `tailwind.config.ts` is minimal (only adds custom color aliases)