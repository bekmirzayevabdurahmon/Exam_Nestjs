import * as morgan from 'morgan'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NotAcceptableException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if(process.env?.NODE_ENV?.trim() == 'development' ) {
    app.use(morgan('tiny'));
  }
  
  app.setGlobalPrefix('/api')

  app.enableCors({
    allowedHeaders: ['authorization'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    optionSuccesStatus: 200,
    origin: "*",
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Users Api')
    .setDescription('The users API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  if(process.env?.NODE_ENV?.trim() == 'development') {
    SwaggerModule.setup('api', app, documentFactory);
  }
  
  const port = process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 4000
  await app.listen(port, () => {
    console.log(`Port running on ${port} ✅`)
  });
}
bootstrap();
