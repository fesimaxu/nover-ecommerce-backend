import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  UserRequestDto,
  SignInRequestDto,
  SignInResponseDto,
  SignUpRequestDto,
  UserMessageResponseDto,
  UserResponseDto,
} from './user.dto';
import { UserRole, UserStatus } from './user.enum';
import { BcryptService } from 'src/helper/bcrypt.service';
import { ProductService } from '../product/product.service';
import { Users } from 'src/dal/user.entity';

@Injectable()
export class UserService {
  logger = new Logger(UserService.name);
  constructor(
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    @InjectRepository(Users)
    private usersRepositoryRepo: Repository<Users>,
  ) {}

  async signUp(
    payload: SignUpRequestDto,
  ): Promise<UserMessageResponseDto | void> {
    try {
      const { email, password, ...rest } = payload;
      const userExists = await this.usersRepositoryRepo.findOne({
        where: { email },
      });
      if (userExists) {
        throw new HttpException('User already exists.', HttpStatus.BAD_REQUEST);
      }
      const hashedPassword = await this.bcryptService.hash(password);

      const userData = {
        ...rest,
        email,
        password: hashedPassword,
      };
      const user = await this.usersRepositoryRepo.insert(userData);
      if (user) return { message: 'User Signup Successful!' };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async signUpAdmin(
    payload: SignUpRequestDto,
  ): Promise<UserMessageResponseDto | void> {
    try {
      const { email, password, ...rest } = payload;
      const userExists = await this.usersRepositoryRepo.findOne({
        where: { email },
      });
      if (userExists)
        throw new HttpException('User already exists.', HttpStatus.BAD_REQUEST);
      const hashedPassword = await this.bcryptService.hash(password);

      const userData = {
        ...rest,
        email,
        role: UserRole.admin,
        password: hashedPassword,
      };
      const user = await this.usersRepositoryRepo.insert(userData);
      if (user) return { message: 'Admin Signup Successful!' };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async signIn(payload: SignInRequestDto): Promise<SignInResponseDto | void> {
    try {
      const { email, password } = payload;
      const userExists = await this.usersRepositoryRepo.findOne({
        where: { email },
      });

      if (!userExists) {
        throw new HttpException('Invalid credentials.', HttpStatus.NOT_FOUND);
      }

      if (userExists && userExists.status === UserStatus.ban) {
        throw new HttpException('Access Denied.', HttpStatus.FORBIDDEN);
      }
      this.logger.log('Sign in user');
      const { id } = await this.validateUser(email, password);
      const sub = { id, email };
      const token = this.jwtService.sign(sub);

      return {
        token,
        id,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async banUser(
    payload: UserRequestDto,
  ): Promise<UserMessageResponseDto | void> {
    try {
      const userExists = await this.usersRepositoryRepo.findOne({
        where: { id: payload.userId },
      });

      if (!userExists) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      const bannedUser = await this.usersRepositoryRepo.update(userExists.id, {
        status: UserStatus.ban,
      });

      if (bannedUser) return { message: 'User Banned Successful!' };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async unBanUser(
    payload: UserRequestDto,
  ): Promise<UserMessageResponseDto | void> {
    try {
      const userExists = await this.usersRepositoryRepo.findOne({
        where: { id: payload.userId },
      });

      if (!userExists) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      const bannedUser = await this.usersRepositoryRepo.update(userExists.id, {
        status: UserStatus.unban,
      });

      if (bannedUser) return { message: 'User Unbanned Successful!' };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getManyBannedUsers(): Promise<UserResponseDto[]> {
    try {
      const bannedUsers = await this.usersRepositoryRepo.find({
        where: { status: UserStatus.ban, role: UserRole.user },
      });

      return bannedUsers;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getManyUnbannedUsers(): Promise<UserResponseDto[]> {
    try {
      const unBannedUsers = await this.usersRepositoryRepo.find({
        where: { status: UserStatus.unban, role: UserRole.user },
      });

      return unBannedUsers;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepositoryRepo.findOne({
      where: { email },
    });

    const mismatch = !(await this.bcryptService.compare(
      password,
      user?.password,
    ));

    if (!user || mismatch)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    return user;
  }
}
