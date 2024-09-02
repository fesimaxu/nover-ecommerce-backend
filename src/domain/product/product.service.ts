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
import {
  ProductMessageResponseDto,
  ProductCreateRequestDto,
  ProductStatusRequestDto,
  ProductUpdateRequestDto,
} from './product.dto';
import { ProductStatus } from './product.enum';
import { UserService } from 'src/domain/user/user.service';
import { Product } from '../../dal/product.entity';

@Injectable()
export class ProductService {
  logger = new Logger(ProductService.name);
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectRepository(Product)
    private productRepositoryRepo: Repository<Product>,
  ) {}

  async create(
    user,
    payload: ProductCreateRequestDto,
  ): Promise<ProductMessageResponseDto> {
    try {
      const data = {
        userId: user.id,
        name: payload.name.toLowerCase(),
        ...payload,
      };

      const productExists = await this.productRepositoryRepo.findOne({
        where: { userId: user.id, name: payload.name },
      });

      if (productExists) {
        throw new HttpException(
          'Product already exists.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const userProduct = await this.productRepositoryRepo.insert(data);
      if (userProduct) return { message: 'Product created successfully' };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async update(
    user,
    id: string,
    payload: ProductUpdateRequestDto,
  ): Promise<ProductMessageResponseDto> {
    try {
      const productExists = await this.productRepositoryRepo.findOne({
        where: { id, userId: user.id },
      });
      if (!productExists) {
        throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
      }

      const updateField: Partial<Product> = {};
      if (payload.name) {
        updateField.name = payload.name;
      }
      if (payload.price) {
        updateField.price = payload.price;
      }
      if (payload.description) {
        updateField.description = payload.description;
      }

      if (payload.quantity) {
        updateField.quantity = payload.quantity;
      }

      const updatedProduct = await this.productRepositoryRepo.update(
        productExists.id,
        updateField,
      );

      if (updatedProduct) return { message: 'Product updated Successful!' };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async approveProduct(
    payload: ProductStatusRequestDto,
  ): Promise<ProductMessageResponseDto | void> {
    try {
      const productExists = await this.productRepositoryRepo.findOne({
        where: { id: payload.productId },
      });

      if (!productExists) {
        throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
      }

      const approveProduct = await this.productRepositoryRepo.update(
        productExists.id,
        {
          status: ProductStatus.approve,
        },
      );

      if (approveProduct) return { message: 'Product approved Successful!' };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async disApproveProduct(
    payload: ProductStatusRequestDto,
  ): Promise<ProductMessageResponseDto | void> {
    try {
      const productExists = await this.productRepositoryRepo.findOne({
        where: { id: payload.productId },
      });

      if (!productExists) {
        throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
      }

      const disApproveProduct = await this.productRepositoryRepo.update(
        productExists.id,
        {
          status: ProductStatus.disapprove,
        },
      );

      if (disApproveProduct)
        return { message: 'Product disapproved Successful!' };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getManyApprovedProducts(): Promise<Product[]> {
    try {
      const approvedProducts = await this.productRepositoryRepo.find({
        where: { status: ProductStatus.approve },
      });

      return approvedProducts;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getManyDisApprovedProducts(): Promise<Product[]> {
    try {
      const disApprovedProducts = await this.productRepositoryRepo.find({
        where: { status: ProductStatus.disapprove },
      });

      return disApprovedProducts;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async delete(user, id: string): Promise<ProductMessageResponseDto> {
    try {
      const productToDelete = await this.productRepositoryRepo.findOne({
        where: {
          id,
        },
      });

      if (!productToDelete) {
        throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
      }
      if (productToDelete.userId !== user.id) {
        throw new HttpException(
          'You are not authorized to delete this product.',
          HttpStatus.FORBIDDEN,
        );
      }

      await this.productRepositoryRepo.delete({
        id,
        userId: user.id,
      });
      return { message: 'Product updated Successful!' };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
