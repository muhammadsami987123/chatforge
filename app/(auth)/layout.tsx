import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <Link href="/" className="cursor-pointer font-semibold tracking-tight">
        ChatForge
      </Link>
      <div className="border-border bg-card mt-8 w-full max-w-sm rounded-xl border p-6">
        {children}
      </div>
    </div>
  );
}
