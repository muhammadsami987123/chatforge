# ChatForge — Development Plan

Status: **pre-alpha, scaffolding not yet written.**
Owner: Muhammad Sami Asghar Mughal.

This document is the phase-level plan. The actionable, checkable backlog lives in
[`TASKS.md`](./TASKS.md). Architectural rules live in [`../CLAUDE.md`](../CLAUDE.md).

---

## 1. Product Thesis

Building a chatbot today means either accepting a closed SaaS (Chatbase, Voiceflow) or wiring the
plumbing yourself — auth, storage, streaming, embedding, retrieval, a widget, rate limits. ChatForge
gives you that plumbing as MIT-licensed software you can self-host in ten minutes.

**Differentiator:** two builder modes over one runtime. Non-technical users get a form. Teams that
need branching, API calls, and conditional logic get a visual canvas. Neither is a dead end — the
form-built bot converts to a flow with one click.

**Non-goals for v1:** multi-provider LLMs, voice, WhatsApp/Slack channels, team workspaces,
marketplace. All deferred to post-1.0 so v1 ships.

---

## 2. Architecture Summary

```
                    ┌──────────────────────────────────────────────┐
   Builder UI ─────►│  Next.js 15 App Router (single deployable)    │
   (dashboard)      │                                              │
                    │  app/api/bots        → session-guarded CRUD   │
   Widget ─────────►│  app/api/chat/[id]   → PUBLIC, CORS, SSE      │
   Share page ─────►│  app/api/knowledge   → upload + ingest        │
   REST client ────►│  app/api/widget/[id] → PUBLIC bootstrap       │
   React SDK ──────►└───────────────┬──────────────────────────────┘
                                    │
                     ┌──────────────▼───────────────┐
                     │   lib/engine (flow runtime)  │
                     │   node executors + run ctx   │
                     └────┬──────────────┬──────────┘
                          │              │
                  ┌───────▼──────┐  ┌────▼─────────┐
                  │  lib/llm     │  │  lib/rag     │
                  │  OpenAI      │  │  pgvector    │
                  └──────────────┘  └──────────────┘
                          │              │
                     ┌────▼──────────────▼────┐
                     │  PostgreSQL + pgvector │
                     └────────────────────────┘
```

**Single execution path.** The Agent Builder (form) compiles to a canonical flow
(`start → retrieval → llm → end`). The Flow Builder edits that flow directly. There is exactly one
interpreter. This is the most important structural decision in the codebase — a second runtime is
how this project would rot.

---

## 3. Phases

### v0.1 — Core Skeleton
**Goal:** a logged-in user can create a bot, give it instructions, and chat with it.

- Repo scaffold: Next.js 15, TypeScript strict, Tailwind, shadcn/ui, ESLint, Prettier, Vitest
- `docker-compose.yml` with `pgvector/pgvector:pg16`
- Prisma schema: `User`, `Bot`, `BotVersion`, `Conversation`, `Message`
- NextAuth: credentials + GitHub + Google; protected dashboard route group
- Zod-validated `lib/env.ts`
- Bot CRUD: list, create, rename, delete
- Agent Builder form: name, persona, system instructions, model, temperature, greeting, fallback
- `lib/llm/openai.ts` provider adapter behind a `LlmProvider` interface
- Minimal engine with `start`, `llm`, `end` executors
- `POST /api/chat/[botId]` streaming SSE
- Chat UI components: message list, composer, typing indicator, error state
- Live preview panel next to the builder
- Hosted share page `/c/[botId]`

**Exit criteria:** create a bot in the UI, chat with it on the share page, transcript persisted.

---

### v0.2 — Knowledge Base (RAG)
**Goal:** the bot answers from your documents, with citations.

- Enable `vector` extension; `KnowledgeSource` and `Chunk` models with an ivfflat index
- Upload: PDF, TXT, MD, DOCX (server-side parse, size and MIME validated)
- URL ingestion: fetch, strip boilerplate, extract main content
- Chunking: recursive character splitter, configurable size/overlap, token-aware
- Embeddings: `text-embedding-3-small`, batched, with retry and backoff
- Ingestion job with status states: `queued → processing → ready → failed`
- `retrieval` node executor: top-k cosine search, score threshold, dedupe
- Context assembly: inject chunks into the system prompt within a token budget
- Source citations returned on the SSE `sources` event and rendered in chat
- Knowledge tab: source list, status, chunk count, re-index, delete

**Exit criteria:** upload a PDF, ask a question only answerable from it, get a cited answer.

---

### v0.3 — Visual Flow Builder
**Goal:** branching, logic, and external calls without code.

- React Flow canvas: pan, zoom, snap grid, minimap, multi-select, undo/redo
- Zustand store for canvas state; autosave with debounce
- Node types + inspector panels: `message`, `input`, `condition`, `retrieval`, `http`, `handoff`
- Run variables: `{{variable}}` templating resolved in messages, prompts, and HTTP bodies
- Flow validation: unreachable nodes, cycles without exit, missing required fields, dangling edges
- Engine: full interpreter with run context, variable scope, max-step guard, cycle detection
- Form → Flow conversion (one-way, one click)
- `BotVersion` snapshots; publish pins a version; draft vs published separation
- Execution trace in preview: highlight the active node path per turn

**Exit criteria:** build a branching support bot with an API lookup entirely on the canvas.

---

### v0.4 — Deployment Surfaces
**Goal:** the bot runs outside ChatForge.

- `packages/widget`: standalone vanilla-TS bundle, shadow DOM isolation, < 20 KB gzipped
- Widget features: launcher bubble, panel, mobile full-screen, theming, persisted session
- `GET /api/widget/[botId]`: public bootstrap config (theme, greeting, allowlist check)
- `ApiKey` model: public keys `pk_*` per bot, revocable
- Origin allowlist enforced on public routes; strict CORS
- Rate limiting: per-IP and per-key, sliding window
- `packages/react-sdk`: `<ChatForgeWidget />`, typed props, SSR-safe, published to npm
- Deploy tab: copy-paste snippet, theme picker, live embed preview, key management
- Public API docs page with SSE event reference

**Exit criteria:** paste the snippet into a blank HTML file on another origin and chat successfully.

---

### v0.5 — Operations
**Goal:** you can see what your bot is doing and what it costs.

- Conversation inbox: list, search, filter by date/status, full transcript view
- Per-message metadata: node path, retrieved sources, latency, prompt/completion tokens
- Analytics: conversations over time, message volume, top questions, deflection rate
- Cost tracking: token accounting per bot per day, model-priced
- Failure surfacing: LLM errors, ingestion failures, HTTP node failures in one place
- Structured logging and health endpoint
- Data retention controls and conversation export (JSON/CSV)

**Exit criteria:** operator can answer "what did users ask this week and what did it cost?"

---

### v1.0 — Polish & Release
- Template gallery: support, lead-gen, FAQ, onboarding, docs Q&A
- Team workspaces: org, members, roles (owner/editor/viewer), invites
- i18n for builder and widget
- Accessibility pass: keyboard nav on canvas and widget, ARIA live regions, contrast
- Hardened self-host guide: Docker, env, backups, migrations, reverse proxy
- Performance: canvas at 200+ nodes, retrieval latency budget, cold-start budget
- E2E suite (Playwright) covering all four deployment surfaces
- Security review, dependency audit, SECURITY.md disclosure process
- Landing page, docs site, demo instance

---

## 4. Post-1.0 Candidates

Ordered by expected demand, not committed:

1. Additional LLM providers — Anthropic, Gemini, Ollama (the adapter already exists)
2. MCP tool calling — let bots invoke real tools
3. Channels — WhatsApp, Slack, Telegram, Discord
4. Human handoff with a live agent console
5. A/B testing between bot versions
6. Voice (STT/TTS)
7. Webhooks and Zapier/n8n connectors
8. Fine-grained guardrails: PII redaction, topic blocklists, jailbreak detection

---

## 5. Cross-Cutting Requirements

**Security.** Public routes (`/api/chat/*`, `/api/widget/*`) are the attack surface: validate
`botId`, check the origin allowlist, rate-limit, cap message length and history depth, never echo
server errors to the client. Everything else is session-guarded. Secrets never reach the client
bundle.

**Performance budgets.** Time-to-first-token under 1.5 s. Retrieval under 300 ms at 10k chunks.
Widget under 20 KB gzipped. Canvas interactive at 200 nodes.

**Testing.** Every node executor has a unit test. Retrieval has a fixture-based ranking test. Each
deployment surface has one E2E path. `pnpm typecheck && pnpm lint && pnpm test` gates every PR.

**Data.** Flow JSON is versioned — any node schema change ships with a migration in
`lib/validation/flow.ts` so existing saved bots keep loading.

---

## 6. Risks

| Risk | Mitigation |
| --- | --- |
| Scope creep into a general agent platform | Post-1.0 list is frozen; v1 exit criteria are written above |
| Flow engine complexity explodes | One interpreter, one node interface, mandatory per-node tests |
| Widget bundle bloat | Hard 20 KB gate in CI; no framework, no shared imports from `app/` |
| RAG quality disappoints | Ship citations + retrieved-chunk visibility so failures are debuggable |
| Public endpoint abuse | Rate limits + origin allowlist land in v0.4, before any public launch |
| Flow schema changes break saved bots | Versioned schema with a migration path, enforced by test fixtures |
