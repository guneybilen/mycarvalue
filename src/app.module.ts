import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
const cookieSession = require('cookie-session');
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';

const db = require('dotenv').config({
  path: '.env.' + process.env.NODE_ENV,
});

export function createTypeOrmProdConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    //@ts-ignore
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    migrationsTableName: 'migrations',
    migrations: ['migrations/*.js'],
    entities: [User, Report],
    synchronize: true,
    logging: true,
    logger: 'advanced-console',
  };
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createTypeOrmProdConfig,
    }),
    ReportsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {
  // constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [`"${db.COOKIE_KEY}"`],
        }),
      )
      .forRoutes('*');
  }
}
