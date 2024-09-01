import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { Base } from './base.entity';
import { ProductStatus } from 'src/product';

@Entity('product')
export class Product extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar' })
  quantity: string;

  @Column({ type: 'varchar' })
  status: ProductStatus;
}
