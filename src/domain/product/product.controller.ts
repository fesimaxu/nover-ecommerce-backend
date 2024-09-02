import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guard/role.guard';
import { ProductService } from './product.service';
import {
  ProductMessageResponseDto,
  ProductCreateRequestDto,
  ProductResponseDto,
  ProductStatusRequestDto,
  ProductUpdateRequestDto,
} from './product.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/decorator/user.decorator';
import { Product } from '../../dal/product.entity';

@ApiTags('Product Management')
@Controller('v1/product')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiResponse({
    status: 201,
    description: 'Created successfully',
    type: ProductCreateRequestDto,
  })
  @ApiOperation({ summary: 'Create Product' })
  @Post('/create')
  async createProduct(
    @User() user,
    @Body() payload: ProductCreateRequestDto,
  ): Promise<ProductMessageResponseDto | void> {
    return await this.productService.create(user, payload);
  }

  @ApiResponse({
    status: 201,
    description: 'Product Updated successfully',
    type: ProductUpdateRequestDto,
  })
  @ApiOperation({ summary: 'Update Product' })
  @Put('/update/:id')
  async update(
    @User() user,
    @Param() param: { id: string },
    @Body() payload: ProductUpdateRequestDto,
  ): Promise<ProductMessageResponseDto> {
    return await this.productService.update(user, param.id, payload);
  }

  @ApiResponse({
    status: 201,
    description: 'Approved Product successful',
    type: ProductMessageResponseDto,
  })
  @ApiOperation({ summary: 'Approve Product' })
  @UseGuards(AdminGuard)
  @Patch('/approve-product')
  async approveProduct(
    @Body() req: ProductStatusRequestDto,
  ): Promise<ProductMessageResponseDto | void> {
    return await this.productService.approveProduct(req);
  }

  @ApiResponse({
    status: 201,
    description: 'Disapprove Product successful',
    type: ProductStatusRequestDto,
  })
  @ApiOperation({ summary: 'Disapprove Product' })
  @UseGuards(AdminGuard)
  @Patch('/disapprove-product')
  async disApproveProduct(
    @Body() req: ProductStatusRequestDto,
  ): Promise<ProductMessageResponseDto | void> {
    return await this.productService.disApproveProduct(req);
  }

  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Array<ProductResponseDto>,
  })
  @ApiOperation({ summary: 'Fetch all approved products' })
  @Get('/all-approved-products')
  async getManyApprovedProducts(): Promise<Product[]> {
    return this.productService.getManyApprovedProducts();
  }

  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Array<ProductResponseDto>,
  })
  @ApiOperation({ summary: 'Fetch all disapproved products' })
  @UseGuards(AdminGuard)
  @Get('/all-disapproved-products')
  async getManyDisApprovedProducts(): Promise<Product[]> {
    return this.productService.getManyDisApprovedProducts();
  }

  @ApiResponse({
    status: 200,
    description: 'The found record deleted',
  })
  @ApiOperation({ summary: 'Delete Product' })
  @Delete('/delete/:id')
  async delete(
    @User() user,
    @Param() param: { id: string },
  ): Promise<ProductMessageResponseDto> {
    return await this.productService.delete(user, param.id);
  }
}
