import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignUpRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class SignInRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class SignInResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  id: string;
}

export class UserMessageResponseDto {
  message: string;
}

export class BanRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
}

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}
