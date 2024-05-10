import {Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, BaseEntity, ManyToMany, JoinTable, ManyToOne} from 'typeorm';
import { JobTitleDepartment } from './job_title_department.entity';
import { user } from './user.entity';

@Entity()
export class JobTitle extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => JobTitleDepartment, (jobTitle) =>jobTitle.department)
  department: JobTitleDepartment;
  
  @OneToMany(() => user, (user) => user.Organization)
  users: user[];

  @OneToMany(() => JobTitleDepartment, (jobTitle) => jobTitle.jobTitle)
  jobTitleDepartments: JobTitleDepartment[];
  

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