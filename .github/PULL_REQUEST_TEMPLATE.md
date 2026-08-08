## What and why

<!-- The diff shows what changed. Explain why it needed to change. -->

Closes #

## Type

- [ ] Bug fix
- [ ] Feature
- [ ] Refactor (no behavior change)
- [ ] Docs
- [ ] Chore / dependencies

## Checks

- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes
- [ ] `pnpm build` passes
- [ ] Single concern — no unrelated refactors or reformatting bundled in

## Tests

<!-- What did you add or change? If none, say why none were needed. -->

- [ ] New flow node executor → has a unit test in `lib/engine/nodes/*.test.ts` (**required**)

## UI changes

<!-- Delete this section if not applicable. Otherwise attach before/after screenshots. -->

## Security-sensitive areas

Tick any this PR touches — these get extra review:

- [ ] `app/api/chat/[botId]` or `app/api/widget/[botId]` (the only public, CORS-open routes)
- [ ] `lib/auth/` or `middleware.ts`
- [ ] Origin allowlist or rate limiting
- [ ] Rendering user or model content as HTML
- [ ] File upload / URL ingestion
- [ ] None of the above

## Migrations

- [ ] No schema change
- [ ] Prisma schema changed — migration included
- [ ] Flow JSON schema changed — migration path added to `lib/validation/flow.ts` so saved bots still load
