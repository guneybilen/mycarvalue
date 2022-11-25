import { Report } from '../reports/report.entity';
import { User } from '../users/user.entity';
import { DataSource } from 'typeorm';

require('dotenv').config({
  path: '.env.' + process.env.NODE_ENV,
});

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  //@ts-ignore
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  entities: [User, Report],
  migrationsTableName: 'migrations',
  migrations: [process.env.MIGRATIONS],
  synchronize: true,
});
