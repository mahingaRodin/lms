import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
      .setTitle('Rwanda Land Administration API')
      .setDescription('Digital land management system API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

  const document = SwaggerModule
    .createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
