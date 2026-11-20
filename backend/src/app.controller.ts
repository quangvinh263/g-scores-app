import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'g-scores-backend',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health/ready')
  async getReadiness() {
    try {
      await this.dataSource.query('SELECT 1');
      return {
        status: 'ready',
        service: 'g-scores-backend',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch {
      throw new ServiceUnavailableException({
        status: 'not_ready',
        service: 'g-scores-backend',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
