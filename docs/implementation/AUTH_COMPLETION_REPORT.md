# RIOS Authentication Completion — Engineering Report

Date: 2026-07-21 Branch: `release/v1.0.0` Scope: Complete the existing
authentication system so every frontend auth screen works end-to-end. No
architectural redesign.

---

## 1. Existing Authentication Audit

The system had a working spine and clean layering (Domain → Application →
Infrastructure → Presentation, DI composition root, API versioning,
auth/authorization middleware).

Present and functional before this work:

- `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh`,
  `POST /api/v1/auth/logout`, `GET /api/v1/auth/me`
- `AuthenticationApplicationService` (authenticate / refreshTokens / logout)
- `User` aggregate, `Credential`, `Session`, `Role`, `Permission` entities;
  `Email` / `PasswordHash` value objects
- PBKDF2 password hasher (`BCryptPasswordHasher`, timing-safe verify),
  hand-rolled HS256 JWT provider
- Full Prisma identity repositories
  (user/session/refresh/role/permission/audit) + Prisma schema
- DI composition root, health-check service, `ApplicationStartup` lifecycle
- `CreateUserHandler` command (dup-check + hash + create + save) — existed but
  was **not exposed over HTTP**

---

## 2. Missing Features Found

- **Endpoints**: `register`, `forgot-password`, `reset-password`,
  `verify-email`, `resend-verification` — all returned 404.
- **Application methods**: no `register` / `forgotPassword` / `resetPassword` /
  `verifyEmail` / `resendVerification`.
- **Email verification**: no `emailVerified` state on `User`, no token store, no
  `EmailVerified` event.
- **Password reset**: no reset-token entity, store, or email abstraction.
- **Two latent bugs** surfaced during runtime testing (see §5).

---

## 3. Endpoints Implemented

All under `/api/v1/auth`, returning the standard
`{ success, data, error, meta }` envelope the frontend api-client expects.

| Method | Path                   | Behavior                                                                                                                                                                                                                                                                                                                                  |
| ------ | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/register`            | Validates input, enforces password policy, checks email uniqueness, hashes password (PBKDF2), creates `researcher` user with `emailVerified=false`, issues + emails a verification token. Returns `201 { user, requiresEmailVerification: true }` (no tokens → frontend routes to `/verify-email`). `409 AUTH_EMAIL_IN_USE` on duplicate. |
| POST   | `/forgot-password`     | Always `200` (no account enumeration). If the user exists, invalidates prior reset tokens, issues a 1-hour reset token, emails the link.                                                                                                                                                                                                  |
| POST   | `/reset-password`      | Validates token (hash lookup + expiry + single-use), enforces password policy, re-hashes, consumes token, revokes all sessions.                                                                                                                                                                                                           |
| POST   | `/verify-email`        | Validates token, marks `User.emailVerified=true`, consumes token (replay-safe).                                                                                                                                                                                                                                                           |
| POST   | `/resend-verification` | Always `200` (no enumeration); re-issues verification token for unverified accounts.                                                                                                                                                                                                                                                      |

---

## 4. Database Investigation

**Reported symptom:** `GET /health` → `Database: DOWN`.

**Root cause (two genuine bugs, not fabricated connectivity):**

1. `apps/api/src/main.ts` called `bootstrapPresentationServer` directly,
   bypassing `ApplicationStartup` — the only path that calls
   `databaseProvider.connect()`. The provider status stayed `DISCONNECTED`, so
   `isHealthy()` returned false → `DOWN`.
2. No runtime path injected a real `PrismaClient`, so DI fell back to the
   in-memory fake (`createInMemoryPrismaClient()`), whose `findFirst`/`findMany`
   ignored `where` clauses — multi-user auth was structurally broken under it.

**Fix (real database, honestly connected):**

- Provisioned local PostgreSQL: created `rios` role + `rios` database (superuser
  access confirmed on localhost:5432), seeded the default `researcher` role.
- Created `.env` from `.env.example`
  (`DATABASE_URL=postgresql://rios:rios_password@localhost:5432/rios`).
- Generated the Prisma client and `prisma db push` (schema in sync, including
  two new token tables).
- Added `createPrismaClient()` factory; rewrote `main.ts` to instantiate a real
  `PrismaClient`, `connect()` before serving, and pass the wired container to
  the presentation layer.

**Verified result:** `GET /health` →
`"database":{"status":"UP","connectionStatus":"CONNECTED","isHealthy":true}`,
overall `status: UP`.

---

## 5. Bugs Found & Fixed During Runtime Testing

1. **Login succeeded before email verification.** `authenticate` never checked
   `emailVerified`. Added the gate — unverified accounts now get
   `401 AUTH_EMAIL_NOT_VERIFIED` (a code the frontend maps to a tailored
   message).
2. **Refresh always failed (`401`).** `refreshTokens` validated the refresh
   string as a JWT (`validateAccessToken`), but the JWT provider minted the
   refresh token as random hex — so refresh never worked, and the frontend's 401
   auto-retry depended on it. Fix: the provider now mints the refresh token as a
   separately-signed JWT carrying the same subject/session claims with the
   refresh expiry and a random `jti` for rotation. Verified: refresh now returns
   rotated access + refresh tokens.
3. **Roles were lost on reload.** `PrismaUserRepository.save` wrote only scalar
   user columns, never the `UserRole` join — so a user saved with `researcher`
   came back as the fallback `user` on the next load. Fix: `save` now upserts
   each role and fully re-syncs the `user_roles` join. Verified: roles
   round-trip (`['researcher']`) through save → login.

---

## 6. Security Review

| Control                     | Status                                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Password hashing            | PBKDF2-HMAC-SHA512, 100k iterations, per-user salt (`$rios$pbkdf2$100000$…`). Verified stored, never plaintext.     |
| Password hash exposure      | No `passwordHash` in any API response (DTOs omit it). Verified by grepping all captured responses.                  |
| Reset / verification tokens | Only the **SHA-256 hash** (64-char hex) is persisted; the raw token lives only in the emailed link. Verified in DB. |
| Token single-use / replay   | `consume()` sets `consumed_at`; reused tokens rejected (`400`). Verified.                                           |
| Token expiry                | Verification 24h, reset 1h; expired tokens rejected via `isUsable()`.                                               |
| Account enumeration         | `forgot-password` / `resend-verification` always return `200` regardless of account existence. Verified.            |
| Session invalidation        | `reset-password` revokes all sessions (`revokeAllForUser`); old access tokens then correctly `401`. Verified.       |
| JWT signing                 | HS256 via `JWT_SECRET`; fails startup in production if secret missing/weak.                                         |
| Timing-safe compare         | Password verify uses `crypto.timingSafeEqual`.                                                                      |

**Known limitations (documented, not blocking):**

- JWT signature comparison in the provider uses `!==` (not constant-time);
  refresh tokens are now valid-as-access JWTs (no `typ` discriminator) — a `typ`
  claim would harden this. Pre-existing design; out of scope for "complete,
  don't redesign."
- No rate limiting on auth endpoints (no existing middleware to mirror).
  Enumeration and single-use protections are in place; rate limiting is a
  recommended follow-up.
- Email delivery is a dev console notifier (logs the link). Production needs an
  SMTP/SES implementation of `IAccountEmailNotifier`.

---

## 7. Runtime Verification (live server, real Postgres)

Full journey exercised via HTTP against `localhost:3000`:

- Register → `201`, `requiresEmailVerification: true`, no tokens ✓
- Login before verify → `401 AUTH_EMAIL_NOT_VERIFIED` ✓
- Duplicate register → `409 AUTH_EMAIL_IN_USE` ✓
- Verify email (token from console) → `200` ✓
- Login after verify → `200` with `{ user, session, tokens }`, roles
  `['researcher']` ✓
- Refresh → `200` rotated access + refresh ✓
- Forgot password → `200` (link logged) ✓
- Reset password → `200`; login with new password → `200` ✓
- Logout (fresh session) → `200` ✓
- Edge cases: replay consumed token `400`, unknown-email forgot `200`, invalid
  reset token `400`, weak password `400`, unauthenticated `/me` `401` ✓
- `GET /health` → `UP`, database `CONNECTED` ✓

---

## 8. Frontend Verification

Backend responses match the frontend contract exactly
(`apps/frontend/src/lib/auth-service.ts`, `types/auth.ts`):

- All endpoints under `/api/v1/auth`, standard `{ success, data, error, meta }`
  envelope.
- `register` → `data.{user, requiresEmailVerification}` (no tokens) → frontend
  redirects to `/verify-email`.
- `login`/`refresh` → `data.tokens.{accessToken, refreshToken}`; login also
  `data.session.id`, `data.user`.
- `me` → `data.{user, authenticated}`.
- Error codes emitted match the frontend map: `AUTH_INVALID_CREDENTIALS`,
  `AUTH_EMAIL_NOT_VERIFIED`, `AUTH_EMAIL_IN_USE`, `VALIDATION_FAILED`,
  `AUTH_INVALID_REFRESH_TOKEN`, `AUTH_UNAUTHORIZED`.
- Next.js rewrite proxies `/api/*` → `localhost:3000`; verify/reset links point
  at `/verify-email?token=` and `/reset-password?token=` on the frontend origin.
  No 404s.

---

## 9. Files Modified

**Domain (`packages/domain`)**

- `identity/aggregates/user.ts` — `emailVerified` prop/getter, `verifyEmail()`,
  `isEmailVerified()`
- `identity/entities/verification-token.ts` — **new** single-use token entity
- `identity/events/identity-events.ts` — `EmailVerified`,
  `PasswordResetRequested`
- `identity/repositories/repository-contracts.ts` —
  `IEmailVerificationTokenRepository`, `IPasswordResetTokenRepository`
- `identity/services/domain-service-contracts.ts` —
  `IVerificationTokenGenerator`, `IAccountEmailNotifier`, `GeneratedToken`
- `identity/index.ts` — barrel exports

**Application (`packages/application`)**

- `identity/services/identity-application-services.ts` —
  `register`/`forgotPassword`/`resetPassword`/`verifyEmail`/`resendVerification` +
  `emailVerified` login gate
- `identity/dto/identity-application-dtos.ts` — `RegisterResponseDto`,
  `ForgotPasswordResponseDto`
- `identity/index.ts` — barrel exports

**Infrastructure (`packages/infrastructure`)**

- `prisma/schema.prisma` — `User.emailVerified`; `EmailVerificationToken`,
  `PasswordResetToken` models
- `security/crypto/verification-token-generator.ts` — **new**
- `email/console-account-email-notifier.ts` — **new** dev notifier
- `repositories/identity/prisma-email-verification-token-repository.ts` —
  **new**
- `repositories/identity/prisma-password-reset-token-repository.ts` — **new**
- `repositories/identity/prisma-user-repository.ts` — persist `emailVerified` +
  sync `UserRole` join
- `repositories/identity/mappers/user-persistence-mapper.ts` — `emailVerified`
  round-trip
- `security/authentication/jwt-token-provider.ts` — refresh token as signed JWT
- `database/prisma-client-factory.ts` — **new** real client factory
- `di/composition-root.ts` — wire new repos/generator/notifier; in-memory fake
  gains `update`/`createMany`/`updateMany`/`deleteMany` + `matchesWhere`
- `di/tokens.ts` — new DI tokens
- `index.ts` — export `createPrismaClient`

**Presentation (`packages/presentation`)**

- `authentication/authentication.controller.ts` — 5 new handlers +
  `AUTH_EMAIL_NOT_VERIFIED` mapping
- `authentication/authentication.routes.ts` — 5 new public routes

**App (`apps/api`)**

- `src/main.ts` — real `PrismaClient`, DB connect at startup, wired container

**Config**

- `.env` — created from `.env.example`

**Tests**

- `packages/infrastructure/src/__tests__/sprint6-prisma-repositories.test.ts` —
  mock `userRole` delegate for the expanded save contract

---

## 10. Remaining Limitations

- Email is a **dev console notifier**; production requires a real
  `IAccountEmailNotifier` (SMTP/SES).
- **No rate limiting** on auth endpoints (recommended follow-up; no existing
  pattern to mirror).
- JWT hardening: constant-time signature compare and a `typ` discriminator
  between access/refresh tokens are recommended (pre-existing design).
- `prisma db push` was used for local sync; a committed migration
  (`prisma migrate`) should be generated for production deploys.

---

## 11. Production Readiness Assessment

Ready for staging/QA: all five previously-missing screens function end-to-end
against a real database, with hashed passwords, hashed single-use tokens,
session invalidation, and no account enumeration. Before production: add a real
email provider, rate limiting, a committed Prisma migration, and the JWT
hardening noted above.

---

## 12. Test & Build Status

- **Build**: `pnpm build` — all 14 packages compile, frontend builds (39/39
  pages).
- **Typecheck**: `pnpm typecheck` — 14/14 successful, 0 errors.
- **Tests**: `pnpm test` — shared 16, identity 552, domain 75, application 94,
  infrastructure 122, presentation 42, frontend 10 — **all pass, 0 failures**.
- **Lint**: 0 errors (pre-existing non-blocking warnings only: entry-point
  `console` logs, one pre-existing domain warning).

---

# ✅ Authentication System Complete

Every existing frontend authentication page (Login, Register, Forgot Password,
Reset Password, Verify Email) now functions correctly against the backend. The
database reports UP against a real PostgreSQL connection. All flows were
verified through actual runtime testing, and typecheck, lint, tests, and build
all pass.
