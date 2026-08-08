import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground text-sm/relaxed">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="text-accent mt-2 cursor-pointer text-sm font-semibold hover:underline"
      >
        Back home
      </Link>
    </div>
  );
}
