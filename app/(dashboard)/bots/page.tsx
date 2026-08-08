import { Bot } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Bots' };

export default function BotsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Bots</h1>

      <div className="border-border mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
        <Bot aria-hidden className="text-muted-foreground size-8" strokeWidth={1.5} />
        <h2 className="font-semibold">No bots yet</h2>
        <p className="text-muted-foreground max-w-sm text-sm/relaxed">
          Bot creation arrives in v0.1 with the agent builder and live preview.
        </p>
      </div>
    </div>
  );
}
