import Link from 'next/link';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="cursor-pointer font-semibold tracking-tight">
            ChatForge
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/sign-in"
              className="text-muted-foreground hover:text-foreground inline-flex h-10 cursor-pointer items-center rounded-lg px-4 text-sm font-medium transition-colors duration-200"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="bg-accent text-accent-foreground inline-flex h-10 cursor-pointer items-center rounded-lg px-4 text-sm font-semibold transition-opacity duration-200 hover:opacity-90"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-border border-t">
        <div className="text-muted-foreground mx-auto w-full max-w-6xl px-6 py-8 text-sm lg:px-8">
          MIT licensed. Built with Next.js and Postgres.
        </div>
      </footer>
    </div>
  );
}
