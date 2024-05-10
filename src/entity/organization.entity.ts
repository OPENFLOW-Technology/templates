import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  CreateDateColumn
} from 'typeorm';
import { user } from './user.entity';

@Entity()
export class Organization extends BaseEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  location: string;

  @ManyToOne(() => Organization, (parent) => parent.childOrganizations, { nullable: true })
  @JoinColumn()
  parentOrganization: Organization;

  @Column({ nullable: true })
  parentOrganizationId: number;

  @OneToMany(() => Organization, (child) => child.parentOrganization)
  childOrganizations: Organization[];

  @OneToMany(() => user, (user) => user.Organization)
  users: user[];


  
  // creation information
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
 
  @Column({ nullable: true })
  last_edited_by: string;

  @Column("timestamp", { nullable: true })
  last_edited_date: Date;

  // soft delete
  @Column({ default: false })
  is_deleted: boolean;

  @Column({ name: 'deleted_date', nullable: true, type: 'timestamp' })
  deleted_date: Date;

  @Column({ name: 'delete_reason', nullable: true })
  delete_reason: string;

  @Column({ name: 'deleted_by', nullable: true })
  deleted_by: string;
}
