import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from 'src/domain/product/product.module';
import { BcryptService } from 'src/helper/bcrypt.service';
import { JwtStrategy } from 'src/guard/jwt.guard';
import { Users } from 'src/dal/user.entity';

@Module({
  imports: [
    PassportModule,
    forwardRef(() => ProductModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback_secret',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, BcryptService],
  exports: [UserService, JwtStrategy],
})
export class UserModule {}
