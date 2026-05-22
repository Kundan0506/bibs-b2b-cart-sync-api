# Single store (bibs-b2b) — four environment variables only

No database. No `SHOPIFY_SHOP` or `SHOPIFY_ACCESS_TOKEN` env vars.

## Render environment variables

| Variable | Value |
|----------|--------|
| `SHOPIFY_API_KEY` | Partner app Client ID |
| `SHOPIFY_API_SECRET` | Client secret |
| `SHOPIFY_APP_URL` | `https://your-service.onrender.com` (no trailing slash) |
| `SCOPES` | `read_customers,write_customers,read_companies,write_companies` |

Optional: `NODE_ENV` = `production` (Render often sets this automatically).

---

## How auth works

1. Install the app on **bibs-b2b** (Custom distribution link).
2. Open the app in Shopify Admin — OAuth runs and the **offline session** is stored in server memory.
3. App Proxy `/apps/company-cart/sync` uses that session for Admin API calls.

**After each Render deploy or restart:** open the app once in Admin on bibs-b2b to refresh the session (no extra env vars).

---

## Deploy checklist

1. **Render** — four env vars above; Node build/start commands from `docs/DEPLOY-RENDER.md`.
2. **`shopify app deploy`** — `application_url` and redirect URLs = your Render URL.
3. **Install** on bibs-b2b → open app in Admin → confirm **Setup** shows green “connected”.
4. **Theme** — POST cart to `/apps/company-cart/sync`.

---

## Storefront sync URL

```
POST https://bibs-b2b.myshopify.com/apps/company-cart/sync
```
