import { Bot } from 'lucide-react';
import Link from 'next/link';

const nav = [{ href: '/bots', label: 'Bots', icon: Bot }];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <aside className="border-border bg-card border-b lg:w-60 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex h-16 items-center px-6">
          <Link href="/bots" className="cursor-pointer font-semibold tracking-tight">
            ChatForge
          </Link>
        </div>
        <nav aria-label="Main" className="flex gap-1 px-3 pb-3 lg:flex-col">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="text-muted-foreground hover:bg-secondary hover:text-foreground flex h-11 cursor-pointer items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-200"
            >
              <Icon aria-hidden className="size-4" strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
