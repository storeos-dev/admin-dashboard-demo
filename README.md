# StoreOS admin dashboard demo

Sandbox custom merchant admin against [StoreOS](https://storeos.dev) core GraphQL on the public API gateway.

Docs: [Custom admin dashboard](https://storeos.dev/docs/guides/admin-dashboard) · [API keys](https://storeos.dev/docs/guides/api-keys)

## Setup

```bash
git clone https://github.com/storeos-dev/admin-dashboard-demo.git
cd admin-dashboard-demo
cp .env.example .env
```

```env
VITE_STOREOS_API_KEY=sos_live_…
VITE_STOREOS_GATEWAY_URL=https://api.storeos.dev
```

```bash
bun install
bun run dev
# → http://localhost:3020
```

Create a **core** API key in Organization settings → API keys, then sign in with a staff email/password. The browser calls the gateway URL directly.
