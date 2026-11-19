import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Score } from '../scores/entities/score.entity';
import { getPostgresSslOptions } from './postgres-ssl';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'admin',
  password: process.env.DB_PASSWORD ?? 'password123',
  database: process.env.DB_NAME ?? 'gscores_db',
  ssl: getPostgresSslOptions(),
  entities: [Score],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
