# hostinger

Source for **angshuman.in**, exported from Hostinger Horizons (React + Vite + Tailwind). Deployed on Netlify.

## Build

```bash
npm install
npm run build        # output: dist/apps/web
```

`netlify.toml` sets the build command, publish directory (`dist/apps/web`), Node 22 and the SPA redirect, so no extra Netlify settings are needed.

## Backend

Only the portfolio CV feature uses Supabase (`portfolio_cv` table, `portfolio-cvs` storage bucket). The public anon key is in `apps/web/src/lib/customSupabaseClient.js`. There is no service-role key in this repo.

## Notes

- `/` is `pages/Home.jsx` (matches the live site), `/apps-hub` is `pages/AppsHub.jsx`, `/hub` is the alternate landing page.
- The live site's "E-Commerce Recovery" tile has no route in this export.
