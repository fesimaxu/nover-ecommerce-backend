import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';
export class ProductCreateRequestDto {
  @ApiProperty({
    description: 'product name',
    example: 'malt',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'product price',
    example: '10',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'product description',
    example: 'drinks',
    required: false,
  })
  @IsDefined()
  description: string;

  @ApiProperty({
    description: 'product quantity',
    example: '10',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  quantity: number;
}

export class ProductUpdateRequestDto {
  @ApiProperty({
    description: 'product name',
    example: 'malt',
    required: true,
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'product price',
    example: '10',
    required: true,
  })
  @IsOptional()
  price: number;

  @ApiProperty({
    description: 'product description',
    example: 'drinks',
    required: false,
  })
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'product quantity',
    example: '10',
    required: true,
  })
  @IsOptional()
  quantity: number;
}

export class ProductStatusRequestDto {
  @ApiProperty({
    description: 'product id',
    example: 'da9b9f51-23b8-4642-97f7-52537b3cf53b',
    format: 'v4',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  productId: string;
}

export class ProductResponseDto {
  @ApiResponseProperty({
    example: 'da9b9f51-23b8-4642-97f7-52537b3cf53b',
    format: 'v4',
  })
  public id: string;

  @ApiResponseProperty({
    example: 'da9b9f51-23b8-4642-97f7-52537b3cf53b',
    format: 'v4',
  })
  public userId: string;

  @ApiResponseProperty({
    example: 'beer',
  })
  public name: string;

  @ApiResponseProperty({
    example: 20,
  })
  public price: number;

  @ApiResponseProperty({
    example: 'drinks',
  })
  public description: string;

  @ApiResponseProperty({
    example: 10,
  })
  public quantity: number;

  @ApiResponseProperty({
    example: 'APPROVE',
  })
  public status: string;
}

export class ProductMessageResponseDto {
  @ApiResponseProperty({
    example: 'success',
  })
  public message: string;
}
