export interface PostgresSslOptions {
  rejectUnauthorized: boolean;
  ca?: string;
}

function toBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value.trim().toLowerCase() === 'true';
}

export function getPostgresSslOptions(
  env: Partial<{
    DB_SSL: string;
    DB_SSL_REJECT_UNAUTHORIZED: string;
    DB_SSL_CA: string;
  }> = process.env,
): false | PostgresSslOptions {
  if (!toBoolean(env.DB_SSL, false)) {
    return false;
  }

  const ca = env.DB_SSL_CA?.trim();

  return {
    rejectUnauthorized: toBoolean(env.DB_SSL_REJECT_UNAUTHORIZED, true),
    ...(ca ? { ca: ca.replace(/\\n/g, '\n') } : {}),
  };
}
