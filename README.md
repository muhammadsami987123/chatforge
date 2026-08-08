<div align="center">

# ChatForge

**Open-source chatbot builder — easy creation of conversational interfaces.**

Build a chatbot with a form or a visual flow canvas. Attach your docs. Publish it as a widget,
a shareable page, an API, or a React component.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-336791)
![Status](https://img.shields.io/badge/status-pre--alpha-orange)

</div>

---

## What it does

ChatForge is a self-hostable platform for building and shipping conversational interfaces without
writing chat plumbing. You get a builder, a knowledge base, a runtime, and four ways to deploy.

- **Two builder modes.** Configure a bot with a simple form (persona, instructions, tools,
  guardrails), or drop into a **visual flow canvas** for branching logic, conditions, and API calls.
  Both compile to the same execution engine.
- **Knowledge base with RAG.** Upload PDF, TXT, Markdown, or crawl a URL. ChatForge chunks it,
  embeds it, and retrieves relevant context on every turn using pgvector.
- **Live preview.** Test the bot side-by-side with the builder. See retrieved chunks, node
  execution path, and token usage per turn.
- **Four deployment surfaces.** Embed widget, hosted share page, REST + streaming API, React SDK.
- **Conversation inbox.** Every transcript, searchable, with per-conversation token and cost totals.
- **Self-hostable.** Docker Compose, your Postgres, your OpenAI key. No vendor lock-in, MIT licensed.

---

## Quick start

**Requirements:** Node.js 20+, pnpm 9+, Docker (for local Postgres), an OpenAI API key.

```bash
git clone https://github.com/muhammadsami987123/chatforge.git
cd chatforge
pnpm install

cp .env.example .env.local
# fill in OPENAI_API_KEY and NEXTAUTH_SECRET

pnpm db:up          # starts postgres with pgvector
pnpm db:push        # applies the schema
pnpm db:seed        # optional: demo bot + starter templates

pnpm dev
```

Open <http://localhost:3000>, create an account, and build your first bot.

---

## Deploying a bot

### Embed widget

Paste on any page. Loads async, ~20 KB gzipped, no dependencies.

```html
<script
  src="https://your-domain.com/widget.js"
  data-bot-id="bot_xxxxxxxx"
  data-position="bottom-right"
  data-accent="#6366f1"
  defer
></script>
```

### Hosted share page

Every published bot gets a full-page chat at:

```
https://your-domain.com/c/bot_xxxxxxxx
```

### REST + streaming API

```bash
curl -N https://your-domain.com/api/chat/bot_xxxxxxxx \
  -H "Content-Type: application/json" \
  -H "X-ChatForge-Key: pk_xxxxxxxx" \
  -d '{"message":"What are your business hours?","conversationId":null}'
```

Responds with `text/event-stream`. Events: `token`, `sources`, `done`, `error`.

### React SDK

```bash
pnpm add @chatforge/react
```

```tsx
import { ChatForgeWidget } from '@chatforge/react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ChatForgeWidget botId="bot_xxxxxxxx" position="bottom-right" accent="#6366f1" />
    </>
  )
}
```

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, Server Components) |
| Language | TypeScript, strict mode |
| Database | PostgreSQL + `pgvector` |
| ORM | Prisma |
| Auth | NextAuth (Auth.js) — credentials, GitHub, Google |
| LLM | OpenAI (provider-adapter pattern for future providers) |
| Streaming | Vercel AI SDK, Server-Sent Events |
| UI | Tailwind CSS + shadcn/ui |
| Canvas | React Flow |
| State | Zustand (builder) + TanStack Query (server) |
| Validation | Zod |
| Testing | Vitest + Playwright |

---

## Flow nodes

| Node | Purpose |
| --- | --- |
| `start` | Entry point, optional greeting |
| `message` | Send static or templated text |
| `input` | Capture and store a user value into run variables |
| `condition` | Branch on a variable expression |
| `llm` | Call the model with assembled context |
| `retrieval` | Query the knowledge base, inject top-k chunks |
| `http` | Call an external API, map the response into variables |
| `handoff` | Escalate to a human / webhook |
| `end` | Terminate the run |

---

## Roadmap

**v0.1 — Core** · auth, bot CRUD, form builder, OpenAI runtime, streaming chat, share page
**v0.2 — Knowledge** · file + URL ingestion, pgvector retrieval, source citations
**v0.3 — Flow** · React Flow canvas, all node types, versioning and publish
**v0.4 — Deploy** · embed widget, React SDK, public API keys, CORS allowlist
**v0.5 — Ops** · conversation inbox, analytics, cost tracking, rate limiting
**v1.0** · templates gallery, team workspaces, i18n, hardened self-host guide

Post-1.0 candidates: Anthropic/Gemini/Ollama providers, MCP tool calling, WhatsApp and Slack
channels, A/B testing, voice.

Detailed breakdown in [`docs/PLAN.md`](docs/PLAN.md). Live backlog in [`docs/TASKS.md`](docs/TASKS.md).

---

## Contributing

Contributions are welcome. Read [`CONTRIBUTING.md`](CONTRIBUTING.md) first — it covers the branch
model, commit convention, and the checks that must pass before a PR is reviewed.

Good first issues are labelled `good first issue`. New flow node types are the easiest high-value
contribution: implement an executor in `lib/engine/nodes/`, add a test, register it, and ship the
inspector panel.

---

## Security

Do not open a public issue for a vulnerability. See [`SECURITY.md`](SECURITY.md) for private
disclosure.

---

## License

MIT © ChatForge contributors. See [`LICENSE`](LICENSE).
