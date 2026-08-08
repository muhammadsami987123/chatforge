import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sign in' };

export default function SignInPage() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-lg font-semibold tracking-tight">Sign in</h1>
      <p className="text-muted-foreground text-sm/relaxed">
        Credentials, GitHub, and Google sign-in land in v0.1.
      </p>
    </div>
  );
}
