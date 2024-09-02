import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration, validationSchema } from 'src/config';
import { dataSourceOptions } from 'src/config/typeorm';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { AppLoggerMiddleware } from 'src/core/middleware';
import { Users } from 'src/dal/user.entity';
import { Product } from '../dal/product.entity';

@Module({
  imports: [
    forwardRef(() =>
      ConfigModule.forRoot({
        isGlobal: true,
        load: [configuration],
        validationSchema,
      }),
    ),
    WinstonModule.forRoot(configuration().logging),
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([Users, Product]),
    UserModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class DomainModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
