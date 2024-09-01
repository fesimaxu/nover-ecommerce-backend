import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { Base } from './base.entity';
import { UserStatus } from 'src/user';

@Entity('users')
export class Users extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', default: 'USER' })
  role: string;

  @Column({ type: 'varchar', default: 'UNBAN' })
  status: UserStatus;
}
