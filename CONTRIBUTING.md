# Contributing to ChatForge

Thanks for helping build ChatForge. This document covers how to get set up and what a mergeable
pull request looks like.

---

## Getting set up

**Requirements:** Node.js 20+, pnpm 9+, Docker, an OpenAI API key.

```bash
pnpm install
cp .env.example .env.local     # fill OPENAI_API_KEY and NEXTAUTH_SECRET
pnpm db:up                     # postgres + pgvector
pnpm db:push
pnpm db:seed
pnpm dev
```

If `db:push` fails on a `vector` type, your Postgres lacks the pgvector extension. Use the provided
`docker-compose.yml` rather than a local Postgres install.

---

## Before opening a pull request

All four must pass:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

CI runs the same commands. A red PR will not be reviewed.

---

## Branch and commit convention

Branches: `feat/flow-condition-node`, `fix/sse-reconnect`, `docs/self-host-guide`,
`chore/bump-prisma`.

Commits follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(engine): add condition node executor
fix(widget): reconnect SSE stream after network drop
docs(readme): document the React SDK
refactor(rag): extract chunker from ingest pipeline
test(engine): cover max-step guard
chore(deps): bump next to 15.2
```

Scopes in use: `engine`, `llm`, `rag`, `builder`, `widget`, `sdk`, `api`, `db`, `auth`, `ui`,
`docs`, `deps`.

---

## What a good PR looks like

- **One concern.** A bug fix does not carry a refactor. A refactor does not carry a feature.
- **Tests where behavior changed.** Every flow node executor requires a unit test — this is not
  optional; the engine is the product.
- **No scope drift.** Don't reformat files you didn't otherwise touch.
- **Description explains why.** The diff already shows what.
- **Screenshots for UI changes.** Before and after.

---

## Code standards

Read [`CLAUDE.md`](./CLAUDE.md) for the full architectural rules. The ones contributors trip on:

1. **TypeScript strict.** No `any` without an eslint-disable and a reason.
2. **Zod at boundaries only.** API input, env, LLM tool arguments, stored JSON. Internal calls are
   trusted — TypeScript already guarantees the shape.
3. **Server Components by default.** Add `'use client'` only for state, effects, or handlers.
4. **No design-token bypass.** Use Tailwind tokens from `globals.css`. No hardcoded hex in
   components.
5. **Comments explain why, never what.** If removing the comment wouldn't confuse a reader, delete
   it.
6. **No premature abstraction.** Three similar implementations is fine. Extract on the fourth.
7. **Never log secrets.** `OPENAI_API_KEY`, `NEXTAUTH_SECRET`, and per-bot API keys must not reach
   the client bundle or any log line.

---

## Adding a flow node type

The highest-value contribution and the cleanest entry point.

1. Add the type to the node union in `lib/validation/flow.ts`, with its config schema.
2. Implement the executor in `lib/engine/nodes/<name>.ts` against the `NodeExecutor` interface.
3. Write `lib/engine/nodes/<name>.test.ts` — happy path, missing config, and error branch.
4. Register it in the executor map in `lib/engine/index.ts`.
5. Build the canvas node component in `components/builder/nodes/`.
6. Build the inspector panel in `components/builder/inspector/`.
7. Add it to the node palette.
8. Document it in the README node table.

---

## Working on the widget

`packages/widget` is a standalone bundle with its own tsconfig. It **cannot** import from `app/` or
`lib/`. It has a hard 20 KB gzipped budget enforced in CI — if you need a utility, inline it.

```bash
pnpm widget:build
pnpm widget:size     # fails over budget
```

---

## Security-sensitive areas

Changes to these require extra review. Flag them explicitly in the PR description.

- `app/api/chat/[botId]` and `app/api/widget/[botId]` — the only public, CORS-open routes
- `lib/auth/` and `middleware.ts`
- Origin allowlist and rate-limiting logic
- Anything that renders user or model content as HTML

Never report a vulnerability in a public issue — see [`SECURITY.md`](./SECURITY.md).

---

## Reporting bugs

Include: what you did, what you expected, what happened, ChatForge version / commit, Node and pnpm
versions, and browser if it's a UI or widget issue. Console and server logs help — redact keys.

---

## Proposing features

Open an issue before writing code for anything non-trivial. Describe the problem, not the
implementation. Check [`docs/PLAN.md`](./docs/PLAN.md) first — it may already be scheduled or
explicitly deferred to post-1.0.

---

## Licensing

By contributing, you agree your contributions are licensed under the MIT License.
