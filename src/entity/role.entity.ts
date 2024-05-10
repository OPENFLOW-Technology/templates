import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn
} from 'typeorm';
import { RolePermission } from './role_permission.entity';
import { UserRoles } from './user_role.entity';
import { Permission } from './permision.entity';
import { user } from './user.entity';

@Entity()
export class Role extends BaseEntity  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, unique: true })
  name: string;

  @Column({ name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ name: 'deleted_date', nullable: true, type: 'timestamp' })
  deleted_date: Date;

  @Column({ name: 'delete_reason', nullable: true })
  delete_reason: string;

  @Column({ name: 'deleted_by', nullable: true })
  deleted_by: string;

  @OneToMany(() => RolePermission, (permission) => permission.role)
  rolePermission: RolePermission[];

  @OneToMany(() => user, (user) => user.role)
  user: user[]
  
  @Column({ nullable: true })
  last_edited_by: string;

  @Column("timestamp", { nullable: true })
  last_edited_date: Date;

}
