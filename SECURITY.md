# Security Policy

## Supported versions

ChatForge is pre-1.0. Only the latest release on `main` receives security fixes.

## Reporting a vulnerability

**Do not open a public issue.**

Report privately via GitHub's **Security → Report a vulnerability** on this repository, or email the
maintainer listed in `package.json`.

Please include:

- The affected component (public chat endpoint, widget, auth, ingestion, flow engine, etc.)
- Reproduction steps or a proof of concept
- The impact you believe it has
- The commit or version tested

**Response targets:** acknowledgement within 72 hours, initial assessment within 7 days, fix or
mitigation plan within 30 days for confirmed high-severity issues.

Please give us a reasonable window to ship a fix before public disclosure. We will credit reporters
in the release notes unless you prefer otherwise.

---

## Scope

**In scope**

- Authentication and session handling
- Authorization gaps — accessing bots, conversations, or keys across accounts
- The public routes `/api/chat/[botId]` and `/api/widget/[botId]`
- Origin allowlist and rate-limit bypass
- SSRF via the `http` flow node or URL knowledge ingestion
- XSS via rendered model output, user messages, or widget theming
- Injection through flow variables or templated prompts
- Secret leakage into client bundles, logs, or API responses
- File upload handling in knowledge ingestion

**Out of scope**

- Prompt injection that only affects the bot's own response text with no data or privilege
  consequence
- Missing hardening headers with no demonstrated exploit
- Vulnerabilities requiring a compromised host or database
- Denial of service through raw request volume against an unconfigured self-host instance
- Issues in third-party dependencies without a working exploit path through ChatForge

---

## Self-hosting hardening checklist

- Set a strong unique `NEXTAUTH_SECRET` (`openssl rand -base64 32`).
- Never expose Postgres to the public internet.
- Configure the per-bot origin allowlist before publishing any bot.
- Put a reverse proxy with TLS and its own rate limits in front of the app.
- Restrict the `http` flow node's reachable hosts if untrusted users can edit flows — it can
  otherwise reach your internal network.
- Rotate per-bot API keys if a key appears in a public repo or client bundle.
- Keep dependencies current: `pnpm audit`.
