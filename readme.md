# Synthesis — env modes and build scripts

This project uses Vite modes and env files to provide separate run/build configs for dev, qa, and prod.

Available scripts (examples)
- npm run dev:dev      -> start dev server using .env.development (port 5173)
- npm run dev:qa       -> start dev server using .env.qa (port 5174)
- npm run dev:prod     -> start dev server using .env.production (port 5175)
- npm run build:dev    -> build for development (.env.development)
- npm run build:qa     -> build for QA (.env.qa)
- npm run build:prod   -> build for production (.env.production)
- npm run preview:qa   -> preview QA build on configured preview port

Env files
- .env.development: defaults for development
- .env.qa: defaults for QA
- .env.production: defaults for production
- .env.local (gitignored): local overrides (put your AG Grid license here)

How to use
1. Copy `.env.local.template` to `.env.local` and fill VITE_AG_GRID_LICENSE_KEY with your license (do NOT commit).
2. Install deps: `npm install`
3. Run dev for QA: `npm run dev:qa`
4. Build production: `npm run build:prod`

Notes
- Vite loads .env.<mode> automatically when you run with `--mode <mode>`. `import.meta.env.VITE_...` is available in runtime.
- Keep sensitive values out of source control; use CI secrets for builds in CI.
