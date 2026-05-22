# Deploy on Render (web service only)

## Environment variables (only four required)

| Key | Value |
|-----|--------|
| `SHOPIFY_API_KEY` | Partner Client ID |
| `SHOPIFY_API_SECRET` | Client secret |
| `SHOPIFY_APP_URL` | `https://<your-service>.onrender.com` |
| `SCOPES` | `read_customers,write_customers,read_companies,write_companies` |

No Postgres. No `SHOPIFY_SHOP` or `SHOPIFY_ACCESS_TOKEN`.

## Web service settings

| Field | Value |
|--------|--------|
| Language | **Node** |
| Build | `npm install && npm run render-build` |
| Start | `npm run start` |

## Shopify

1. `shopify app deploy` with Render URL in `shopify.app.toml`.
2. Install on bibs-b2b → open app in Admin after each Render redeploy.

See `docs/SINGLE-STORE.md`.
