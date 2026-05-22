# Deploy on Render (web service only — no database)

Single-store app for **bibs-b2b**. See **`docs/SINGLE-STORE.md`** for token setup.

---

## Render Web Service

| Field | Value |
|--------|--------|
| Language | **Node** |
| Build Command | `npm install && npm run render-build` |
| Start Command | `npm run start` |
| Database | **None** |

### Environment variables

| Key | Value |
|-----|--------|
| `NODE_ENV` | `production` |
| `SHOPIFY_SHOP` | `bibs-b2b.myshopify.com` |
| `SHOPIFY_ACCESS_TOKEN` | Offline token after install |
| `SHOPIFY_API_KEY` | Client ID |
| `SHOPIFY_API_SECRET` | Client secret |
| `SHOPIFY_APP_URL` | `https://<your-service>.onrender.com` |
| `SCOPES` | `read_customers,write_customers,read_companies,write_companies` |

---

## After deploy

1. Install app on bibs-b2b (Custom distribution link).
2. Open app → **Setup** → copy token → set `SHOPIFY_ACCESS_TOKEN` → redeploy.
3. Update Partner Dashboard URLs and run `shopify app deploy`.

Full checklist: `docs/SINGLE-STORE.md`.
