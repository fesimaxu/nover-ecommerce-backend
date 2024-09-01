import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/dal';
import {
  BanRequestDto,
  SignInRequestDto,
  SignInResponseDto,
  SignUpRequestDto,
  UserMessageResponseDto,
  UserResponseDto,
} from './user.dto';
import { BcryptService } from 'src/helper';
import { UserRole, UserStatus } from './user.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly UsersRepositoryRepo: Repository<Users>,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(
    payload: SignUpRequestDto,
  ): Promise<UserMessageResponseDto | void> {
    try {
      const { email, password, ...rest } = payload;
      const userExists = await this.UsersRepositoryRepo.findOne({
        where: { email },
      });
      if (userExists)
        throw new HttpException(
          {
            status: 400,
            message: ['User already exist.'],
            error: 'Bad Request',
          },
          400,
        );
      const hashedPassword = await this.bcryptService.hash(password);

      const userData = {
        ...rest,
        email,
        password: hashedPassword,
      };

      const user = await this.UsersRepositoryRepo.create(userData);
      if (user) return { message: 'User Signup Successful!' };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signUpAdmin(
    payload: SignUpRequestDto,
  ): Promise<UserMessageResponseDto | void> {
    try {
      const { email, password, ...rest } = payload;
      const userExists = await this.UsersRepositoryRepo.findOne({
        where: { email },
      });
      if (userExists)
        throw new HttpException(
          {
            status: 400,
            message: ['User already exist.'],
            error: 'Bad Request',
          },
          400,
        );
      const hashedPassword = await this.bcryptService.hash(password);

      const userData = {
        ...rest,
        email,
        role: UserRole.admin,
        password: hashedPassword,
      };

      const user = await this.UsersRepositoryRepo.create(userData);
      if (user) return { message: 'Admin Signup Successful!' };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signIn(payload: SignInRequestDto): Promise<SignInResponseDto | void> {
    try {
      const { email, password } = payload;
      const userExists = await this.UsersRepositoryRepo.findOne({
        where: { email },
      });

      if (!userExists) {
        throw new HttpException(
          {
            status: 404,
            message: ['Invalid credentials.'],
            error: 'Bad Request',
          },
          404,
        );
      }

      if (userExists && userExists.status === UserStatus.ban) {
        throw new HttpException(
          {
            status: 403,
            message: ['Access Denied.'],
            error: 'Bad Request',
          },
          403,
        );
      }

      const { id } = await this.validateUser(email, password);
      const sub = { id };
      const token = this.jwtService.sign(sub);

      return {
        token,
        id,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async banUser(
    payload: BanRequestDto,
  ): Promise<UserMessageResponseDto | void> {
    try {
      const userExists = await this.UsersRepositoryRepo.findOne({
        where: { id: payload.userId },
      });

      if (!userExists) {
        throw new HttpException(
          {
            status: 404,
            message: ['User not found.'],
            error: 'Bad Request',
          },
          404,
        );
      }

      const bannedUser = await this.UsersRepositoryRepo.update(userExists.id, {
        status: UserStatus.ban,
      });

      if (bannedUser) return { message: 'User Banned Successful!' };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async unBanUser(
    payload: BanRequestDto,
  ): Promise<UserMessageResponseDto | void> {
    try {
      const userExists = await this.UsersRepositoryRepo.findOne({
        where: { id: payload.userId },
      });

      if (!userExists) {
        throw new HttpException(
          {
            status: 404,
            message: ['User not found.'],
            error: 'Bad Request',
          },
          404,
        );
      }

      const bannedUser = await this.UsersRepositoryRepo.update(userExists.id, {
        status: UserStatus.unban,
      });

      if (bannedUser) return { message: 'User Unbanned Successful!' };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getManyBanUsers(): Promise<UserResponseDto[]> {
    try {
      const banUsers = await this.UsersRepositoryRepo.find({
        where: { status: UserStatus.ban },
      });

      return banUsers;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getManyUnbanUsers(): Promise<UserResponseDto[]> {
    try {
      const unBanUsers = await this.UsersRepositoryRepo.find({
        where: { status: UserStatus.unban },
      });

      return unBanUsers;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async validateUser(email: string, password: string): Promise<any> {
    const user = await this.UsersRepositoryRepo.findOne({
      where: { email },
    });

    const mismatch = !(await this.bcryptService.compare(
      password,
      user?.password,
    ));

    if (!user || mismatch)
      throw new HttpException(
        {
          status: 400,
          message: 'Invalid credentials',
        },
        400,
      );
    return user;
  }
}
