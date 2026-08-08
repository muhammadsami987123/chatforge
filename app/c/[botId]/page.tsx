import { notFound } from 'next/navigation';

export default async function SharePage({ params }: { params: Promise<{ botId: string }> }) {
  const { botId } = await params;

  if (!botId) notFound();

  return (
    <div className="flex min-h-dvh items-center justify-center px-6 py-12">
      <div className="border-border bg-card w-full max-w-md rounded-xl border p-6">
        <h1 className="font-semibold tracking-tight">Hosted chat</h1>
        <p className="text-muted-foreground mt-2 text-sm/relaxed">
          The public chat surface for this bot ships in v0.1.
        </p>
      </div>
    </div>
  );
}
