import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany} from 'typeorm';
import { user } from './user.entity'
@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title', nullable: false })
  title: string;

  @Column({ name: 'description', nullable: false })
  description: string;

  @Column({ name: 'link', nullable: false })
  link: string;

  @Column({ name: 'state', nullable: false })
  state: string;

  @Column({ name: 'seen', nullable: false, default: false })
  seen: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => user, (user) => user.notifications)
  user: user;
}