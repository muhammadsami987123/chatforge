import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sign up' };

export default function SignUpPage() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-lg font-semibold tracking-tight">Create an account</h1>
      <p className="text-muted-foreground text-sm/relaxed">
        Account creation lands in v0.1 alongside NextAuth.
      </p>
    </div>
  );
}
