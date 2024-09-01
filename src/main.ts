import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { TransformInterceptor } from './core/incerceptor';

const { APP_ENV } = process.env;
const appName = 'Nover E-Commerce';
const isCors = APP_ENV == 'production' ? true : false;
const logger = new Logger(`main.${appName}.bootstrap`);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: isCors });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalInterceptors(new TransformInterceptor());

  const options = new DocumentBuilder()
    .setTitle('Nover E-Commerce')
    .setDescription('Nover E-Commerce')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;

  await app.listen(port);

  logger.log('--------- Application starts ---------');
  logger.log('--------------------------------------');
  logger.log(`Listening on port: ${port} for the ${appName} app`);
}
bootstrap();
