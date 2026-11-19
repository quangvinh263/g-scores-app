import { AppController } from './app.controller';

describe('AppController', () => {
  it('returns a healthy status', () => {
    const controller = new AppController();
    expect(controller.getHealth()).toMatchObject({
      status: 'ok',
      service: 'g-scores-backend',
    });
  });
});
