import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'g-scores-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
