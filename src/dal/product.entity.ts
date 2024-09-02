import { ProductStatus } from 'src/domain/product/product.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'varchar', default: 'APPROVE' })
  status: ProductStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
