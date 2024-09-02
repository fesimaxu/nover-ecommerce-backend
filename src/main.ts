import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { TransformInterceptor } from './core/incerceptor';
import AppDataSource from './config/typeorm';
import { GlobalExceptionFilter } from './core/middleware/filter.middleware';

const { NODE_ENV } = process.env;
const appName = 'Nover E-Commerce';
const isCors = NODE_ENV == 'production' ? true : false;
const logger = new Logger(`main.${appName}.bootstrap`);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: isCors });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle('Nover E-Commerce')
    .setDescription('Nover E-Commerce')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/nover/api/swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  AppDataSource.initialize();
  const port = process.env.PORT || 3000;

  await app.listen(port);

  logger.log('--------- Application starts ---------');
  logger.log('--------------------------------------');
  logger.log(`Listening on port: ${port} for the ${appName} app`);
}
bootstrap();
