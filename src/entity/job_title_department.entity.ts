import {Entity, PrimaryColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, BaseEntity, OneToOne, JoinColumn, OneToMany} from 'typeorm';
import { JobTitle } from './jobtitle.entity';
import { Department } from './department.entity';

@Entity()
export class JobTitleDepartment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  
  @ManyToOne(() => Department, (dep) => dep.jobTitleDepartments)
  department: Department;

  @ManyToOne(() => JobTitle, (jobTitle) => jobTitle.jobTitleDepartments)
  jobTitle: JobTitle;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

}