# ChatForge — Task Backlog

Working backlog. Phase context in [`PLAN.md`](./PLAN.md).

**Legend:** `[ ]` todo · `[~]` in progress · `[x]` done · `[!]` blocked
**Definition of done:** code + test + `pnpm typecheck && pnpm lint && pnpm test` green.

---

## Phase 0 — Foundation

- [x] Decide architecture, builder UX, LLM provider, license
- [x] `CLAUDE.md`
- [x] `README.md`
- [x] `LICENSE` (MIT)
- [x] `docs/PLAN.md`
- [x] `docs/TASKS.md`
- [x] `CONTRIBUTING.md`
- [x] `SECURITY.md`
- [x] `.env.example`
- [ ] `pnpm init`, TypeScript strict, path aliases
- [ ] Next.js 15 App Router scaffold
- [ ] Tailwind + shadcn/ui init, design tokens in `globals.css`
- [ ] ESLint + Prettier + `lint-staged` + Husky pre-commit
- [ ] Vitest setup with a first passing test
- [ ] `docker-compose.yml` — `pgvector/pgvector:pg16`
- [ ] `lib/env.ts` Zod env parsing
- [x] GitHub Actions CI: typecheck, lint, test, build
- [x] Issue + PR templates, `CODE_OF_CONDUCT.md`
- [x] GitHub repo created and pushed

---

## Phase v0.1 — Core Skeleton

### Data
- [ ] Prisma init + client singleton in `lib/db/`
- [ ] Models: `User`, `Account`, `Session`, `Bot`, `BotVersion`, `Conversation`, `Message`
- [ ] `pnpm db:push`, `db:studio`, `db:seed` scripts
- [ ] Seed: demo user + starter bot

### Auth
- [ ] NextAuth with Prisma adapter
- [ ] Credentials provider (bcrypt) + GitHub + Google OAuth
- [ ] `(auth)` route group: sign-in, sign-up, error pages
- [ ] Middleware guarding `(dashboard)`
- [ ] `lib/auth/session.ts` server-side helper

### Bot CRUD
- [ ] `GET/POST /api/bots`
- [ ] `GET/PATCH/DELETE /api/bots/[botId]` with ownership check
- [ ] Dashboard bot list with empty state
- [ ] Create-bot dialog
- [ ] Bot layout shell + tab nav (agent / knowledge / flow / conversations / deploy / settings)

### Agent Builder (form mode)
- [ ] Form: name, avatar, persona, system instructions, model, temperature, max tokens
- [ ] Greeting message + fallback message fields
- [ ] Zod schema `lib/validation/bot.ts`
- [ ] Autosave with dirty-state indicator
- [ ] Compile form config → canonical flow JSON

### LLM layer
- [ ] `LlmProvider` interface in `lib/llm/types.ts`
- [ ] `lib/llm/openai.ts` adapter (streaming + non-streaming)
- [ ] Prompt assembly: system + history + retrieved context
- [ ] Token counting and history truncation to a budget
- [ ] Error mapping: rate limit, auth, context length, timeout

### Engine
- [ ] `RunContext` type: variables, history, bot config, trace
- [ ] `NodeExecutor` interface
- [ ] `start`, `llm`, `end` executors + tests
- [ ] Interpreter loop with max-step guard
- [ ] Flow schema + validator `lib/validation/flow.ts`

### Chat
- [ ] `POST /api/chat/[botId]` SSE stream
- [ ] Event contract: `token`, `sources`, `done`, `error`
- [ ] Persist conversation + messages
- [ ] `components/chat/`: message list, bubble, composer, typing dots, error banner
- [ ] Markdown rendering with safe sanitization
- [ ] Live preview panel in the builder
- [ ] Hosted share page `/c/[botId]` with 404 for unpublished bots

**Milestone:** create → configure → chat → transcript saved.

---

## Phase v0.2 — Knowledge Base

- [ ] Enable `vector` extension in migration
- [ ] Models: `KnowledgeSource`, `Chunk` (`vector(1536)`) + ivfflat index
- [ ] `POST /api/knowledge/upload` — MIME + size validation
- [ ] Parsers: PDF, TXT, MD, DOCX
- [ ] URL ingestion: fetch + main-content extraction
- [ ] Recursive chunker with token-aware sizing and overlap
- [ ] `lib/rag/embed.ts` — batched `text-embedding-3-small` with retry/backoff
- [ ] Ingestion pipeline with status transitions + failure reasons
- [ ] `lib/rag/retrieve.ts` — top-k cosine, score threshold, dedupe
- [ ] `retrieval` node executor + fixture ranking test
- [ ] Context injection within a token budget
- [ ] `sources` SSE event + citation UI in chat
- [ ] Knowledge tab: source list, status badges, chunk counts, re-index, delete
- [ ] Retrieved-chunk inspector in preview

**Milestone:** upload a PDF → ask a doc-only question → cited answer.

---

## Phase v0.3 — Visual Flow Builder

### Canvas
- [ ] React Flow install + canvas shell
- [ ] Zustand store; debounced autosave
- [ ] Node palette with drag-to-add
- [ ] Custom node components with per-type styling
- [ ] Inspector side panel bound to selection
- [ ] Undo/redo, copy/paste, multi-select, minimap
- [ ] Auto-layout button

### Nodes
- [ ] `message` executor + inspector + test
- [ ] `input` executor + inspector + test
- [ ] `condition` executor + expression editor + test
- [ ] `http` executor (URL, method, headers, body, response mapping) + test
- [ ] `handoff` executor (webhook payload) + test
- [ ] `{{variable}}` templating resolver + test

### Correctness
- [ ] Flow validator: unreachable nodes, dangling edges, missing fields, exit-less cycles
- [ ] Validation panel with click-to-focus on the offending node
- [ ] Cycle detection + max-step guard in the interpreter
- [ ] Execution trace: highlight the active node path in preview

### Versioning
- [ ] `BotVersion` snapshot on publish
- [ ] Draft vs published state; "unpublished changes" indicator
- [ ] Version history + rollback
- [ ] Form → Flow one-click conversion

**Milestone:** a branching support bot with an API lookup, built entirely on canvas.

---

## Phase v0.4 — Deployment Surfaces

### Widget
- [ ] `packages/widget` standalone tsup build
- [ ] Shadow DOM style isolation
- [ ] Launcher bubble + panel; mobile full-screen
- [ ] Theming from `data-*` attributes
- [ ] Session persistence in `localStorage`
- [ ] SSE client with reconnect
- [ ] CI size gate: fail over 20 KB gzipped
- [ ] Serve at `/widget.js` with cache headers

### Public API
- [ ] `ApiKey` model; `pk_*` generation, display-once, revoke
- [ ] `GET /api/widget/[botId]` bootstrap config
- [ ] Origin allowlist per bot, enforced on public routes
- [ ] CORS handling + preflight
- [ ] Rate limiting: per-IP and per-key sliding window
- [ ] Message length + history depth caps
- [ ] Sanitized public error responses

### React SDK
- [ ] `packages/react-sdk` build + types
- [ ] `<ChatForgeWidget />` with typed props, SSR-safe
- [ ] `useChatForge()` headless hook
- [ ] README + npm publish workflow

### Deploy tab
- [ ] Copy-paste snippet generator
- [ ] Theme picker with live embed preview
- [ ] API key management UI
- [ ] Origin allowlist editor
- [ ] Public API reference page

**Milestone:** snippet works from a different origin.

---

## Phase v0.5 — Operations

- [ ] Conversation inbox: list, search, date/status filter, pagination
- [ ] Transcript view with node path + retrieved sources per message
- [ ] Per-message latency and token metadata
- [ ] Analytics: conversations/day, messages/day, top questions, deflection rate
- [ ] Cost tracking with a model price table
- [ ] Error center: LLM, ingestion, and HTTP-node failures
- [ ] Structured logging + `/api/health`
- [ ] Retention settings + conversation export (JSON/CSV)

---

## Phase v1.0 — Release

- [ ] Template gallery (5 starters) + one-click clone
- [ ] Workspaces: org, members, roles, invites
- [ ] i18n for builder + widget
- [ ] Accessibility: canvas keyboard nav, ARIA live regions, contrast audit
- [ ] Self-host guide: Docker, backups, migrations, reverse proxy
- [ ] Perf: 200-node canvas, retrieval latency, cold start
- [ ] Playwright E2E across all four surfaces
- [ ] Security review + `pnpm audit` clean
- [ ] Landing page, docs site, public demo
- [ ] v1.0.0 release notes

---

## Bug / Debt Log

_Empty. Add entries as `- [ ] <symptom> — <file:line> — <severity>`._

---

## Decision Log

| Date | Decision | Rationale |
| --- | --- | --- |
| 2026-08-08 | Next.js 15 full-stack monorepo | Single deployable, fastest path to a self-host story |
| 2026-08-08 | Both form and flow builders | Form for reach, flow for depth; one runtime serves both |
| 2026-08-08 | OpenAI only at launch | Behind a provider adapter; more providers post-1.0 |
| 2026-08-08 | MIT license | Maximum adoption for a dev tool |
| 2026-08-08 | Postgres + Prisma + NextAuth | Standard self-hostable OSS stack |
| 2026-08-08 | pgvector RAG in v1 | Doc Q&A is the primary chatbot use case; not deferrable |
| 2026-08-08 | All four deploy surfaces in v1 | Widget alone is table stakes; API + SDK drive adoption |
