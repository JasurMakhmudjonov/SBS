import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import * as basicAuth from 'express-basic-auth';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { appConfig, swaggerConfig } from '@config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(
    '/api/docs',
    basicAuth({
      challenge: true,
      users: {
        [swaggerConfig.username]: swaggerConfig.password,
      },
    }),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api');
  app.enableVersioning();

  const swaggerDocs = new DocumentBuilder()
    .setTitle('Staduim Booking System')
    .setDescription('The SBS API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerDocs);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(appConfig.port, () => {
    console.log(`Server: http://localhost:${appConfig.port}/api`);
    console.log(`Swagger: http://localhost:${appConfig.port}/api/docs`);
  });
}
bootstrap();
