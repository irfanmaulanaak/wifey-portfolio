# Nadhifa Arnesya — Portfolio

A responsive bilingual portfolio for Nadhifa Aulia Arnesya, SEO Specialist and Content Strategist. The project includes nine detailed SEO and social-media cases, extracted project visuals, highlighted impact metrics, and an English/Indonesian language switcher.

## Preview locally

Serve the `dist` directory with any static web server.

```bash
python3 -m http.server 8000 --directory dist
```

Then open `http://localhost:8000`.

## Structure

- `dist/index.html` — site content and accessible structure
- `dist/styles.css` — responsive editorial design
- `dist/script.js` — bilingual copy, project filtering, and reveal transitions
- `dist/assets/` — portfolio imagery and downloadable documents
- `wrangler.jsonc` — Cloudflare Workers static-assets configuration
- `.github/workflows/deploy-cloudflare.yml` — automatic Workers deployment

## Deploy to Cloudflare Workers

The workflow deploys `dist/` to `wifey-portfolio.<your-subdomain>.workers.dev` whenever `main` is updated.

1. In Cloudflare, create an API token with `Account > Workers Scripts > Edit` for the target account.
2. In GitHub, open **Settings > Secrets and variables > Actions**.
3. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as repository secrets.
4. Push to `main`, or run **Deploy to Cloudflare Workers** manually from the Actions tab.

Secrets are intentionally not stored in this repository.
