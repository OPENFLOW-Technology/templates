import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    ManyToOne,
    PrimaryGeneratedColumn,

  } from "typeorm";
// import { contact } from "./contact.entity";
import {Department} from "./department.entity";
// import {jobTitle} from "./job_title.entity";

import { JobTitle } from "./jobtitle.entity";
import {UserRoles} from "./user_role.entity";
import { Notification } from "./notification";
import { Organization } from './organization.entity';
import { Role } from "./role.entity";

@Entity()
  export class user extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    uid: string;

    @Column()
    email: string;

    @Column()
    phoneNumber: string;

    @Column()
    userName: string;

    @Column()
    passwordHash: string;


    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

      
    @Column({nullable: true})
    profilePhotoURL: string;

    @Column({nullable: true})
    email_verified: string;
    
// user activity info

    @Column({nullable: true})
    last_logged_in: string;

    @Column()
    is_active: boolean;

// OTP & Activation 
    @Column({nullable: true})
    verification_OTP: string;

    @Column({default: 0, nullable: true})
    otp_trial_count: number;
    
    @Column({nullable: true})
    otp_verified: boolean;    
    
    @Column({nullable: true, default: null})
    forgotten_password_token: string;
  
// User relations
    @Column({nullable: true})
    organization_id: number;

    @ManyToOne(() => Department, (dep) => dep.users)
    department: Department;

    @ManyToOne(() => JobTitle, (jobTitle) => jobTitle.users)
    Job_Title: JobTitle;

    @ManyToOne(() => Organization, (organization) => organization.users)
    Organization: Organization;

    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Notification[];

    @ManyToOne(() => Role, (role) => role.user)
    role: Role  
    



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
  