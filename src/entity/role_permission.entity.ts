import {Entity, PrimaryColumn, ManyToOne, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity} from 'typeorm';
import { Permission } from './permision.entity';
import { Role } from './role.entity';

@Entity()
export class RolePermission  extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
    
  @ManyToOne(() => Role, (role) => role.rolePermission)
  role: Role;
  
  @ManyToOne(() => Permission, (permission) => permission.rolePermission)
  permission: Permission;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;

}

