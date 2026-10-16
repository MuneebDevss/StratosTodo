# Claude connector deployment

The frontend must forward the OAuth endpoints advertised by the backend's
authorization-server metadata. Previously `/oauth/authorize` did not exist on
the frontend, so Claude's sign-in navigation returned 404 before reaching NestJS.
[Next.js rewrites](../next.config.ts) now forward OAuth, discovery, and `/mcp`
requests to the backend. `/oauth/consent` remains a frontend page.

## Required production configuration

- Frontend Vercel environment: set `NEXT_PUBLIC_API_URL` to the deployed NestJS
  API base, including `/api` if Nest uses that global prefix. Do not use localhost
  or the frontend origin. Optional `BACKEND_URL` overrides the rewrite destination
  only; use the NestJS origin (without `/api`). The rewrites strip a trailing
  `/api` from either variable because the supplied NestJS bootstrap excludes
  OAuth, discovery, and MCP from the REST prefix.
- Backend: set `APP_URL=https://stratos-todo.vercel.app` (no trailing slash or
  `/api`) when exposing MCP through this frontend. The supplied controller and
  guard use this value for the public issuer, resource, and discovery URLs.
- Backend: set `FRONTEND_URL=https://stratos-todo.vercel.app` so authorization
  redirects to the consent page on the same origin as the user's login storage.
- The consent page posts to the same-origin OAuth proxy, retaining the API
  client's bearer token and refresh behavior. Normal REST requests still use
  `NEXT_PUBLIC_API_URL` with its `/api` prefix.
- Set `NEXT_PUBLIC_MCP_SERVER_URL=https://stratos-todo.vercel.app/mcp` for the
  connector URL displayed in settings.

Redeploy the frontend after changing these variables; rewrites and public
variables are resolved during the build. These changes do not modify or deploy
the separate backend.

## Verification after deployment

1. Fetch `https://stratos-todo.vercel.app/.well-known/oauth-authorization-server`.
   It must return JSON with reachable authorization and token endpoints.
2. Request `/mcp` without credentials. Expect 401 and `WWW-Authenticate` pointing
   to the public protected-resource metadata URL. Fetch that URL and confirm
   its resource is `https://stratos-todo.vercel.app/mcp`.
3. Start a fresh connection in Claude (old authorization links contain transient
   state and PKCE values). Sign in and verify the callback completes.
4. Repeat while signed out, and with an expired login session. Sign-in should
   preserve the OAuth query and return to consent.
5. Ask Claude to read tasks to verify token exchange and MCP access end to end.

Local routing regression checks: `node --test tests/oauth-routing.test.cjs`.

The backend remains responsible for validating registered redirect URIs,
requested scopes, PKCE, and authorization codes. A successful local routing test
does not verify the deployed backend, token exchange, or Claude account access.
