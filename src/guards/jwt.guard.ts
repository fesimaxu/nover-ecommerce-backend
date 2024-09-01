import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'fallback_secret',
    });
  }

  async validate(payload: { email: string }): Promise<any> {
    const { email } = payload;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpException(
        {
          status: 403,
          message: 'Unauthorized',
        },
        403,
      );
    }

    return user;
  }
}
