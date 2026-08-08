import { z } from 'zod';

const optionalString = z
  .string()
  .trim()
  .transform((value) => (value === '' ? undefined : value))
  .optional();

const positiveIntFromString = (fallback: number) =>
  z.coerce.number().int().positive().default(fallback);

export const serverEnvSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

    DATABASE_URL: z.string().url().startsWith('postgres'),

    NEXTAUTH_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(32),

    GITHUB_CLIENT_ID: optionalString,
    GITHUB_CLIENT_SECRET: optionalString,
    GOOGLE_CLIENT_ID: optionalString,
    GOOGLE_CLIENT_SECRET: optionalString,

    OPENAI_API_KEY: z.string().min(1),
    OPENAI_DEFAULT_MODEL: z.string().min(1).default('gpt-4o-mini'),
    OPENAI_EMBEDDING_MODEL: z.string().min(1).default('text-embedding-3-small'),

    MAX_UPLOAD_SIZE_MB: positiveIntFromString(10),
    MAX_MESSAGE_LENGTH: positiveIntFromString(4000),
    MAX_HISTORY_MESSAGES: positiveIntFromString(20),
    RATE_LIMIT_PER_MINUTE: positiveIntFromString(30),
  })
  .superRefine((value, ctx) => {
    const pairs = [
      ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET'],
      ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
    ] as const;

    for (const [idKey, secretKey] of pairs) {
      const hasId = value[idKey] !== undefined;
      const hasSecret = value[secretKey] !== undefined;
      if (hasId !== hasSecret) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [hasId ? secretKey : idKey],
          message: `${idKey} and ${secretKey} must be set together, or both left blank to disable the provider.`,
        });
      }
    }
  });

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

function format(error: z.ZodError, scope: string): never {
  const details = error.issues
    .map((issue) => `  • ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid ${scope} environment variables:\n${details}`);
}

export const clientEnv: ClientEnv = (() => {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });
  return parsed.success ? parsed.data : format(parsed.error, 'client');
})();

let cachedServerEnv: ServerEnv | undefined;

export function serverEnv(): ServerEnv {
  if (typeof window !== 'undefined') {
    throw new Error('serverEnv() was called in the browser. Server secrets must never be bundled.');
  }
  if (!cachedServerEnv) {
    const parsed = serverEnvSchema.safeParse(process.env);
    cachedServerEnv = parsed.success ? parsed.data : format(parsed.error, 'server');
  }
  return cachedServerEnv;
}
