import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity, CreateDateColumn, ManyToMany} from 'typeorm';
import { JobTitleDepartment } from './job_title_department.entity';
import { user } from './user.entity';
import { Organization } from './organization.entity'; // Import the Organization entity
import { JobTitle } from './jobtitle.entity';
// import { DepartmentOrganization } from './departmentOrganization.entity';

@Entity()
export class Department extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => JobTitleDepartment, (jobTitle) => jobTitle.department)
  jobTitleDepartments: JobTitleDepartment[];

  @OneToMany(() => user, (user) => user.department)
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
