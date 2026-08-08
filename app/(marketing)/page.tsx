import { Boxes, Database, GitBranch, Plug, ShieldCheck, Workflow } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Workflow,
    title: 'Two builders, one runtime',
    body: 'Configure a bot with a form, or wire branching logic on a visual canvas. Both compile to the same flow — neither is a dead end.',
  },
  {
    icon: Database,
    title: 'Knowledge base built in',
    body: 'Upload PDFs, docs, or URLs. Chunked, embedded, and retrieved with pgvector so answers cite their sources.',
  },
  {
    icon: Plug,
    title: 'Four ways to ship',
    body: 'An embeddable widget, a hosted share page, a REST and SSE API, and a typed React SDK. Every surface is first-class.',
  },
  {
    icon: GitBranch,
    title: 'Versioned publishing',
    body: 'Publishing pins an immutable snapshot. Draft freely, roll back instantly, and never break a live bot.',
  },
  {
    icon: ShieldCheck,
    title: 'Safe by default',
    body: 'Origin allowlists, per-bot API keys, sliding-window rate limits, and message caps on every public endpoint.',
  },
  {
    icon: Boxes,
    title: 'Yours to self-host',
    body: 'MIT licensed. One Next.js app plus Postgres. Deploy to Vercel or run the Docker Compose stack.',
  },
];

export default function LandingPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 py-16 sm:gap-32 sm:py-24 lg:px-8">
      <section className="flex flex-col items-center text-center">
        <span className="border-border bg-secondary text-secondary-foreground rounded-full border px-3 py-1 text-xs font-medium tracking-wide">
          MIT licensed · self-hostable
        </span>

        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          Build a chatbot without building the plumbing
        </h1>

        <p className="text-muted-foreground mt-6 max-w-xl text-lg/relaxed">
          ChatForge gives you auth, storage, streaming, retrieval, and an embeddable widget as
          open-source software you run yourself.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/sign-up"
            className="bg-accent text-accent-foreground ring-offset-background focus-visible:ring-ring inline-flex h-12 min-w-44 cursor-pointer items-center justify-center rounded-lg px-6 text-sm font-semibold transition-opacity duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Start building
          </Link>
          <Link
            href="https://github.com/muhammadsami987123/chatforge"
            className="border-border text-foreground hover:bg-secondary focus-visible:ring-ring inline-flex h-12 min-w-44 cursor-pointer items-center justify-center rounded-lg border px-6 text-sm font-semibold transition-colors duration-200 focus-visible:ring-2"
          >
            View source
          </Link>
        </div>
      </section>

      <section aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">
          Features
        </h2>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="border-border bg-card flex flex-col gap-3 rounded-xl border p-6"
            >
              <Icon aria-hidden className="text-accent size-6" strokeWidth={1.5} />
              <h3 className="text-card-foreground font-semibold">{title}</h3>
              <p className="text-muted-foreground text-sm/relaxed">{body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
