describe('CORS origin normalization', () => {
  const normalizeOrigins = (value: string): string[] =>
    value
      .split(',')
      .map((origin) => origin.trim())
      .map((origin) => origin.replace(/\/+$/, ''))
      .filter(Boolean);

  it('matches a browser origin when environment value has a trailing slash', () => {
    const origins = normalizeOrigins(
      'https://g-scores-app-three.vercel.app/',
    );

    expect(origins).toContain('https://g-scores-app-three.vercel.app');
  });
});
