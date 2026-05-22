# Single store mode (bibs-b2b) — no database

This app does **not** use Postgres or Prisma. Cart data stays on Shopify (`custom.company_cart`).  
Only the **Admin API access token** for `bibs-b2b` is stored in environment variables.

---

## Render environment variables

| Variable | Example / notes |
|----------|------------------|
| `SHOPIFY_SHOP` | `bibs-b2b.myshopify.com` |
| `SHOPIFY_ACCESS_TOKEN` | Offline token (see below) |
| `SHOPIFY_API_KEY` | Partner app Client ID |
| `SHOPIFY_API_SECRET` | Client secret |
| `SHOPIFY_APP_URL` | `https://bibs-b2b-cart-sync-api.onrender.com` |
| `SCOPES` | `read_customers,write_customers,read_companies,write_companies` |

**Do not create a Render PostgreSQL instance** for this app.

---

## Get `SHOPIFY_ACCESS_TOKEN` (one time)

### Option A — From the app after install (easiest)

1. Deploy to Render with `SHOPIFY_SHOP` set but **leave `SHOPIFY_ACCESS_TOKEN` empty**.
2. Install the app on bibs-b2b (Custom distribution link).
3. Open the app in Admin → **Setup** (`/app/setup`).
4. If a token is shown, copy it → paste into Render as `SHOPIFY_ACCESS_TOKEN` → **Redeploy**.
5. Confirm **Setup** shows the green “token is set” banner.

> Token on Setup is only available on the **same running instance** right after install. If the page is empty after redeploy, use Option B.

### Option B — From local `shopify app dev`

1. Locally: `shopify app dev` with `.env` including `SHOPIFY_SHOP`.
2. Install / open the app on bibs-b2b.
3. Open **Setup** and copy the token, or read it from your local session storage if you temporarily log it in dev.

---

## Render Web Service settings

| Field | Value |
|--------|--------|
| Language | **Node** |
| Build | `npm install && npm run render-build` |
| Start | `npm run start` |
| Postgres | **None** |

---

## Security

- Requests are limited to `SHOPIFY_SHOP` when that env var is set.
- Keep `SHOPIFY_ACCESS_TOKEN` secret (Render **Secret** env var).
- If the token is rotated or the app is reinstalled, update the env var and redeploy.

---

## Theme

Storefront sync URL (unchanged):

```
POST https://bibs-b2b.myshopify.com/apps/company-cart/sync
```

See theme repo `bibs-b2b-cart-sync` for Liquid/JS integration.
