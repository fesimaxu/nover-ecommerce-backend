import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BanRequestDto,
  SignInRequestDto,
  SignInResponseDto,
  SignUpRequestDto,
  UserMessageResponseDto,
  UserResponseDto,
} from './user.dto';
import { UserService } from './user.service';
import { AdminGuard } from 'src/guards/role.guard';

@ApiTags('User Management')
@Controller('v1/user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: 201,
    description: 'Sign up successful',
    type: SignUpRequestDto,
  })
  @ApiOperation({ summary: 'Sign up' })
  @Post('/sign-up')
  async signUp(
    @Body() req: SignUpRequestDto,
  ): Promise<UserMessageResponseDto | void> {
    return await this.userService.signUp(req);
  }

  @ApiResponse({
    status: 201,
    description: 'Admin Sign up successful',
    type: SignUpRequestDto,
  })
  @ApiOperation({ summary: 'Admin Sign up' })
  @Post('/admin/sign-up')
  async signUpAdmin(
    @Body() req: SignUpRequestDto,
  ): Promise<UserMessageResponseDto | void> {
    return await this.userService.signUpAdmin(req);
  }

  @ApiResponse({
    status: 201,
    description: 'Sign in successful',
    type: SignInResponseDto,
  })
  @ApiOperation({ summary: 'Sign in' })
  @Post('/sign-in')
  async signIn(
    @Body() req: SignInRequestDto,
  ): Promise<SignInResponseDto | void> {
    const data = await this.userService.signIn(req);
    return data;
  }

  @ApiResponse({
    status: 201,
    description: 'Banned User successful',
    type: UserMessageResponseDto,
  })
  @ApiOperation({ summary: 'Ban user' })
  @UseGuards(AdminGuard)
  @Patch('/ban-user')
  async banUser(
    @Body() req: BanRequestDto,
  ): Promise<UserMessageResponseDto | void> {
    return await this.userService.banUser(req);
  }

  @ApiResponse({
    status: 201,
    description: 'Unbanned User successful',
    type: UserMessageResponseDto,
  })
  @ApiOperation({ summary: 'Unban user' })
  @UseGuards(AdminGuard)
  @Patch('/unban-user')
  async unBanUser(
    @Body() req: BanRequestDto,
  ): Promise<UserMessageResponseDto | void> {
    return await this.userService.unBanUser(req);
  }

  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Array<UserResponseDto>,
  })
  @ApiOperation({ summary: 'Fetch all ban users' })
  @UseGuards(AdminGuard)
  @Get('/all-ban-users')
  async getManyBanUsers(): Promise<UserResponseDto[]> {
    return this.userService.getManyBanUsers();
  }

  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Array<UserResponseDto>,
  })
  @ApiOperation({ summary: 'Fetch all unban users' })
  @UseGuards(AdminGuard)
  @Get('/all-unban-users')
  async getManyUnbanUsers(): Promise<UserResponseDto[]> {
    return this.userService.getManyUnbanUsers();
  }
}
