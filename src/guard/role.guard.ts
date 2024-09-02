import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const { user } = context.switchToHttp().getRequest();

      if (user.role !== 'ADMIN') {
        throw new HttpException(
          'Only Admin have permission to access this resource',
          HttpStatus.FORBIDDEN,
        );
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
}
