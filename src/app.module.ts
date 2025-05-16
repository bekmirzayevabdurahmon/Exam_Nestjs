import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';
import { UserModule } from './modules/user';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductModule } from './modules/product/product.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CheckAuthGuard, CheckRolesGuard } from './gurds';
import { JwtHelper } from './helpers';

console.log(process.env.DB_HOST)
console.log(process.env.ACCESS_TOKEN_SECRET)

@Module({
  imports: [
ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', 
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('ACCESS_TOKEN_SECRET');
        console.log('JWT Secret from ConfigService:', secret); 
        if (!secret) {
          throw new Error('ACCESS_TOKEN_SECRET is not defined in .env');
        }
        return {
          secret,
          signOptions: { expiresIn: '60m' },
          global: true, 
        };
      },
      inject: [ConfigService],
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
    ProductModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CheckAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CheckRolesGuard,
    },
    JwtHelper,
    JwtService,
  ],
})

export class AppModule {}
