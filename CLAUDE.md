# CLAUDE.md

Context for Claude Code when working in the **ChatForge** repository.

---

## 1. What This Project Is

**ChatForge** — an open-source chatbot builder for easy creation of conversational interfaces.

Users sign in, build a bot two ways (a form-based agent config **or** a visual node flow), attach a
knowledge base, test it in a live preview, then publish it as an embeddable widget, a hosted share
page, a REST/SSE API, or a React component.

**License:** MIT. **Positioning:** self-hostable alternative to Typebot / Voiceflow / Chatbase.

---

## 2. Locked Technical Decisions

These were decided at project inception. Do **not** re-litigate them in a PR without an issue first.

| Area | Decision |
| --- | --- |
| Architecture | Next.js 15 full-stack monorepo (App Router). Single deploy target: Vercel or Docker. |
| Language | TypeScript, `strict: true`. No `any` without a `// eslint-disable` + reason. |
| Builder UX | **Both** modes: form-based Agent Builder **and** visual Flow Builder (React Flow). Shared runtime. |
| LLM provider | **OpenAI only** at launch. All calls go through a provider adapter so others can be added later. |
| Database | PostgreSQL + Prisma ORM. `pgvector` extension for embeddings. |
| Auth | NextAuth (Auth.js) — credentials + GitHub + Google. |
| RAG | v1 scope. File/URL ingestion → chunk → OpenAI embeddings → pgvector cosine search. |
| Styling | Tailwind CSS + shadcn/ui. Design tokens in `globals.css`, never hardcoded hex in components. |
| State | Zustand for builder canvas state. TanStack Query for server state. No Redux. |
| Validation | Zod at every boundary (API input, env, flow schema, widget config). |
| Streaming | Server-Sent Events via the Vercel AI SDK. No WebSockets in v1. |
| Package manager | pnpm. |

**Delivery surfaces (all four are v1):** embed widget, hosted share page `/c/{botId}`, REST + SSE
API, and an npm React SDK.

---

## 3. Repository Layout

```
chatforge/
├── app/
│   ├── (marketing)/              # public landing
│   ├── (auth)/                   # sign-in, sign-up
│   ├── (dashboard)/
│   │   ├── bots/                 # bot list, create
│   │   └── bots/[botId]/
│   │       ├── agent/            # form-based builder
│   │       ├── flow/             # React Flow canvas
│   │       ├── knowledge/        # RAG sources
│   │       ├── conversations/    # transcript inbox
│   │       ├── deploy/           # embed snippet, API keys
│   │       └── settings/
│   ├── c/[botId]/                # hosted public chat page
│   └── api/
│       ├── auth/[...nextauth]/
│       ├── bots/                 # CRUD
│       ├── chat/[botId]/         # public SSE chat endpoint
│       ├── knowledge/            # upload + ingest
│       └── widget/[botId]/       # widget bootstrap config (public, CORS)
├── lib/
│   ├── engine/                   # flow interpreter — node executors, run context
│   ├── llm/                      # OpenAI adapter, prompt assembly, token accounting
│   ├── rag/                      # chunking, embedding, retrieval
│   ├── db/                       # prisma client singleton, queries
│   ├── auth/
│   └── validation/               # shared Zod schemas
├── components/
│   ├── ui/                       # shadcn primitives — do not hand-edit, regenerate
│   ├── builder/                  # canvas, node types, inspector panel
│   └── chat/                     # message list, composer, typing indicator
├── packages/
│   ├── widget/                   # vanilla TS embed script → dist/widget.js
│   └── react-sdk/                # <ChatForgeWidget /> npm package
├── prisma/schema.prisma
├── docs/                         # PLAN.md, TASKS.md, ARCHITECTURE.md
└── docker-compose.yml            # postgres + pgvector for local dev
```

---

## 4. Core Domain Model

Read `prisma/schema.prisma` for truth. The concepts:

- **Bot** — a published chatbot. Owns config, flow, knowledge, and conversations.
- **BotVersion** — immutable snapshot of a bot's flow + config. Publishing pins a version.
- **Flow** — `{ nodes: Node[], edges: Edge[] }` JSON, validated by `lib/validation/flow.ts`.
- **Node** — one of: `start`, `message`, `input`, `condition`, `llm`, `retrieval`, `http`, `handoff`, `end`.
- **KnowledgeSource** → **Chunk** — a source doc and its embedded chunks.
- **Conversation** → **Message** — an end-user session and its turns.
- **ApiKey** — per-bot public key used by widget/API callers.

**Invariant:** the flow engine is the single execution path. The form-based Agent Builder does not
have its own runtime — it compiles down to a minimal flow (`start → retrieval → llm → end`). Never
add a second execution path.

---

## 5. Engineering Rules

These extend the global rules in `~/.claude/CLAUDE.md` (minimal file reads, token efficiency,
search-before-read, scoped edits).

1. **Search first.** Grep for the symbol before opening a file. Don't read whole modules to make a
   one-line change.
2. **Stay in your module.** Editing a flow node? Touch `lib/engine/nodes/` and its test. Don't
   drift into `components/` or the widget package unless the task says so.
3. **UI work loads `ui-ux-pro-max`.** Mandatory for any component or page work.
4. **Zod at boundaries only.** Internal function calls are trusted — TypeScript already guarantees
   shapes. Validate user input, env vars, LLM tool arguments, and stored JSON.
5. **Every node executor gets a unit test.** `lib/engine/nodes/*.test.ts`. The engine is the
   product; untested nodes are unacceptable.
6. **Never log or serialize secrets.** `OPENAI_API_KEY`, `NEXTAUTH_SECRET`, and per-bot API keys
   never reach the client bundle or a log line.
7. **The public chat endpoint is untrusted input.** Rate-limit, validate `botId`, verify the
   origin against the bot's allowlist, and cap message length and history depth.
8. **No comments explaining what code does.** Only comment a non-obvious *why*.
9. **No premature abstraction.** Three similar node executors is fine. Extract on the fourth.
10. **Server Components by default.** Add `'use client'` only when you need state, effects, or
    event handlers.

---

## 6. Commands

```bash
pnpm dev              # next dev --turbopack
pnpm build            # production build
pnpm lint             # eslint
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest
pnpm db:up            # docker compose up -d postgres
pnpm db:push          # prisma db push
pnpm db:studio        # prisma studio
pnpm db:seed          # seed demo bot + templates
pnpm widget:build     # build packages/widget → dist/widget.js
```

**Before declaring any task complete:** `pnpm typecheck && pnpm lint && pnpm test`.

---

## 7. Environment

Copy `.env.example` → `.env.local`. Required:

```
DATABASE_URL=            # postgres, must have pgvector installed
NEXTAUTH_URL=
NEXTAUTH_SECRET=         # openssl rand -base64 32
OPENAI_API_KEY=
NEXT_PUBLIC_APP_URL=
```

Env is parsed and validated through `lib/env.ts` (Zod). Never read `process.env` directly in
application code.

---

## 8. Things That Will Bite You

- **pgvector is not optional.** A plain Postgres will fail on migration. `pnpm db:up` uses the
  `pgvector/pgvector` image.
- **The widget bundles separately.** It cannot import from `app/` or `lib/` — it's a standalone
  vanilla-TS build with its own tsconfig. Keep it under 20 KB gzipped.
- **`/api/chat/[botId]` and `/api/widget/[botId]` are public and CORS-open.** Every other route is
  session-guarded. Getting this backwards is the highest-severity bug class in this repo.
- **Flow JSON is versioned.** Changing the node schema requires a migration path in
  `lib/validation/flow.ts`, not just a type edit — existing saved bots must keep loading.
- **Streaming responses break if any middleware buffers.** Don't add response transforms on the
  chat route.

---

## 9. Where To Look

- Roadmap and phase breakdown → `docs/PLAN.md`
- Actionable task backlog → `docs/TASKS.md`
- Contribution workflow → `CONTRIBUTING.md`
