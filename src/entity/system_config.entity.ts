import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
  } from 'typeorm';
  
  @Entity()
  export class SystemConfig extends BaseEntity  {
    @PrimaryGeneratedColumn()
    config_id: number;
  
    @Column({ nullable: true, unique: true })
    config_name: string;
  
    @Column({ nullable: true, unique: true })
    config_value: string;
  }
  