import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';
import { UserModule } from './modules/user';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

console.log(process.env.DB_HOST)

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logging: console.log,
      sync: {
        alter: true
      },
      autoLoadModels: true
    }),
    UserModule,
  ],
})
export class AppModule {}
