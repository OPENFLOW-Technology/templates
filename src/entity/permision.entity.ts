import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, BaseEntity, CreateDateColumn} from 'typeorm';
import { RolePermission } from './role_permission.entity';

@Entity()
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'permission_id' })
  id: number;

  @Column({nullable: true, unique: true})
  name: string;

  @Column({ default: "ungrouped" })
  permission_group: string;

  @Column({ name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => RolePermission, (permission) => permission.permission)
  rolePermission: RolePermission[];
  
}
