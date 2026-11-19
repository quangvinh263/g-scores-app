import { getPostgresSslOptions } from './postgres-ssl';

describe('getPostgresSslOptions', () => {
  it('disables SSL for local PostgreSQL by default', () => {
    expect(getPostgresSslOptions({})).toBe(false);
  });

  it('enables strict SSL with a verified certificate', () => {
    expect(
      getPostgresSslOptions({
        DB_SSL: 'true',
        DB_SSL_REJECT_UNAUTHORIZED: 'true',
      }),
    ).toEqual({ rejectUnauthorized: true });
  });

  it('supports a custom CA and escaped newline conversion', () => {
    expect(
      getPostgresSslOptions({
        DB_SSL: 'true',
        DB_SSL_REJECT_UNAUTHORIZED: 'true',
        DB_SSL_CA: 'line-one\\nline-two',
      }),
    ).toEqual({
      rejectUnauthorized: true,
      ca: 'line-one\nline-two',
    });
  });
});
