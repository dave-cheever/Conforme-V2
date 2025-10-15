# Better Auth Organizations: Full Adoption (Merge into Existing Collection, No Org Migration)

### Server changes (Express)

- Add the `organization` plugin to `betterAuth` in `Express/src/utils/auth/auth.ts`.
- Configure schema mapping to reuse the existing `organizations` collection:
- `schema.organization.modelName = "organizations"`
- `schema.organization.fields.slug = "domain"`
- `schema.organization.fields.logo = "logoUrl"`
- Add any required custom fields via `additionalFields` (mark sensitive ones `input: false`).
- Lock org writes to preserve your manual-DB workflow:
- `organizationHooks.beforeCreateOrganization` → upsert by `domain` or block creation unless explicitly allowed.
- `organizationHooks.beforeUpdateOrganization` → allow only BA-managed fields (e.g., `name`, `logo`), ignore updates to your config fields (`modules`, SharePoint IDs, tenant/client/secret).
- `disableOrganizationDeletion: true`.
- Define roles: `owner`, `admin`, `member`. Map your roles → BA roles (`admin` → `admin`, `reader/user` → `member`).
- Session: Resolve `domain` from request, call `auth.organization.setActive` for the matching org, and ensure a membership exists (create if missing) with mapped role.
- Keep GraphQL resolvers unchanged:
- `Express/src/graphql/resolvers/organizations/organization.q.ts` continues to use `Organizations.customFindByDomain(getDomain(req))` and `sessionizeOrganization`.

### Client changes (React)

- Update `React/src/utils/auth-client.ts` to include the organization client plugin:
- `plugins: [organizationClient({ schema: inferOrgAdditionalFields<typeof auth>() })]`.
- Keep current UI flows; expose org creation/invites/role updates later via `authClient.organization.*`.

### Data migration

- No organization document migration.
- Membership bootstrapping happens on first sign-in per domain: if membership is missing, create with mapped role; the first admin can be treated as `owner` if needed.

### Authorization convergence

- Begin replacing ad-hoc checks with `organization.hasPermission` (client) or server guards with plugin roles.
- Temporarily bridge your `isPermitted` to BA roles to avoid broad refactors.

### Email/invites

- Implement `sendInvitationEmail` using your SendGrid service.

### Testing (≥80% on changed code)

- Unit test `auth.ts` plugin config + org hooks (no destructive writes), domain→active org resolution, and membership ensure logic.
- Client: test organization client wiring (mock fetch).

### Rollout

- Deploy behind a feature flag for new org admin UI.
- Validate in pre‑prod that sessions select the expected active org by domain and that memberships are created on sign‑in.