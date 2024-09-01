import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/user';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();

    if (user.role !== UserRole.admin) {
      throw new HttpException(
        {
          status: 403,
          message: 'Only Admin have permission to access this resource',
        },
        403,
      );
    }
    return true;
  }
}
