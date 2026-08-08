import { describe, expect, it } from 'vitest';

import { serverEnvSchema } from './env';

const valid = {
  DATABASE_URL: 'postgresql://chatforge:chatforge@localhost:5432/chatforge?schema=public',
  NEXTAUTH_URL: 'http://localhost:3000',
  NEXTAUTH_SECRET: 'a'.repeat(32),
  OPENAI_API_KEY: 'sk-test',
};

describe('serverEnvSchema', () => {
  it('accepts a minimal valid environment and applies defaults', () => {
    const result = serverEnvSchema.parse(valid);

    expect(result.OPENAI_DEFAULT_MODEL).toBe('gpt-4o-mini');
    expect(result.OPENAI_EMBEDDING_MODEL).toBe('text-embedding-3-small');
    expect(result.MAX_MESSAGE_LENGTH).toBe(4000);
    expect(result.NODE_ENV).toBe('development');
  });

  it('coerces numeric limits from strings', () => {
    const result = serverEnvSchema.parse({ ...valid, MAX_UPLOAD_SIZE_MB: '25' });

    expect(result.MAX_UPLOAD_SIZE_MB).toBe(25);
  });

  it('rejects a non-postgres DATABASE_URL', () => {
    const result = serverEnvSchema.safeParse({ ...valid, DATABASE_URL: 'mysql://localhost/db' });

    expect(result.success).toBe(false);
  });

  it('rejects a short NEXTAUTH_SECRET', () => {
    const result = serverEnvSchema.safeParse({ ...valid, NEXTAUTH_SECRET: 'too-short' });

    expect(result.success).toBe(false);
  });

  it('treats blank optional OAuth credentials as disabled', () => {
    const result = serverEnvSchema.parse({
      ...valid,
      GITHUB_CLIENT_ID: '',
      GITHUB_CLIENT_SECRET: '',
    });

    expect(result.GITHUB_CLIENT_ID).toBeUndefined();
    expect(result.GITHUB_CLIENT_SECRET).toBeUndefined();
  });

  it('rejects a half-configured OAuth provider', () => {
    const result = serverEnvSchema.safeParse({ ...valid, GITHUB_CLIENT_ID: 'id-only' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(['GITHUB_CLIENT_SECRET']);
    }
  });
});
