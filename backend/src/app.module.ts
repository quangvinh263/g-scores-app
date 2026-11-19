import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoresModule } from './scores/scores.module';
import { AppController } from './app.controller';
import { getPostgresSslOptions } from './database/postgres-ssl';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        ssl: getPostgresSslOptions({
          DB_SSL: config.get<string>('DB_SSL'),
          DB_SSL_REJECT_UNAUTHORIZED: config.get<string>(
            'DB_SSL_REJECT_UNAUTHORIZED',
          ),
          DB_SSL_CA: config.get<string>('DB_SSL_CA'),
        }),
        autoLoadEntities: true,
        synchronize: false,
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
      }),
    }),
    ScoresModule,
  ],
})
export class AppModule {}
