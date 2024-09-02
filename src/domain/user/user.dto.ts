import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

export class SignUpRequestDto {
  @ApiProperty({
    description: 'lastname firstname',
    example: 'igwe uchenna',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'email',
    example: 'user@gmail.com',
    required: true,
  })
  @IsDefined()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'password',
    example: 'IWILL2000u#',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  password: string;
}

export class SignInRequestDto {
  @ApiProperty({
    description: 'email',
    example: 'user@gmail.com',
    required: true,
  })
  @IsDefined()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'password',
    example: 'IWILL2000u#',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  password: string;
}

export class SignInResponseDto {
  @ApiResponseProperty({
    example:
      'eyJhbGN2U0MTY3NWRkNyIsImlhdCI6MTcyNTI3MTM1MCwiZXhwIjoxNzI1Mjc0OTUwfQ.rD3d39IQ7it-MNqvGJ',
    format: 'jwt',
  })
  token: string;

  @ApiResponseProperty({
    example: 'da9b9f51-23b8-4642-97f7-52537b3cf53b',
    format: 'v4',
  })
  public id: string;
}

export class UserMessageResponseDto {
  @ApiResponseProperty({
    example: 'success',
  })
  public message: string;
}

export class UserRequestDto {
  @ApiProperty({
    description: 'user id',
    example: 'da9b9f51-23b8-4642-97f7-52537b3cf53b',
    format: 'v4',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  userId: string;
}

export class UserResponseDto {
  @ApiResponseProperty({
    example: 'da9b9f51-23b8-4642-97f7-52537b3cf53b',
    format: 'v4',
  })
  public id: string;

  @ApiResponseProperty({
    example: 'igwe uchenna',
  })
  public name: string;

  @ApiResponseProperty({
    example: 'user@gmail.com',
  })
  public email: string;

  @ApiResponseProperty({
    example: 'USER',
  })
  public role: string;

  @ApiResponseProperty({
    example: 'UNBAN',
  })
  public status: string;
}
