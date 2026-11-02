# StoreOS admin dashboard demo

Sandbox custom merchant admin against [StoreOS](https://storeos.dev) core GraphQL on the public API gateway.

Docs: [Custom admin dashboard](https://storeos.dev/docs/guides/admin-dashboard) · [API keys](https://storeos.dev/docs/guides/api-keys)

## What's included

- Staff sign-in (`identity__login`)
- Overview KPIs (`report__dashboardOverview`)
- Orders list + detail
- Products list

## Setup

```bash
git clone https://github.com/storeos-dev/admin-dashboard-demo.git
cd admin-dashboard-demo
cp .env.example .env
```

```env
VITE_STOREOS_API_KEY=sos_live_…
STOREOS_GATEWAY_URL=https://api.storeos.dev
# or local gateway:
# STOREOS_GATEWAY_URL=http://localhost:8788
```

```bash
bun install   # or npm install
bun run dev   # → http://localhost:3020
```

1. In the StoreOS console: **Organization settings → API keys** → create a key with **core** access.
2. Put it in `.env` as `VITE_STOREOS_API_KEY`.
3. Sign in with a staff email/password for that store.

The browser calls `/core/graphql` on the same origin; Vite proxies that to `STOREOS_GATEWAY_URL` (the gateway does not allow CORS).
