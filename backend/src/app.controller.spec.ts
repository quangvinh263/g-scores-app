import { AppController } from './app.controller';

jest.mock('@nestjs/typeorm', () => ({
  InjectDataSource: () => () => undefined,
}));

describe('AppController', () => {
  it('returns a healthy status', () => {
    const controller = new AppController({} as never);
    expect(controller.getHealth()).toMatchObject({
      status: 'ok',
      service: 'g-scores-backend',
    });
  });

  it('returns ready when PostgreSQL responds', async () => {
    const controller = new AppController({
      query: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
    } as never);

    await expect(controller.getReadiness()).resolves.toMatchObject({
      status: 'ready',
      database: 'connected',
    });
  });
});
