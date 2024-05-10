import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from "typeorm";

  @Entity()
  export class error_log extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    level: string; // e.g., 'info', 'error', 'warning'
  
    @Column({ type: 'varchar', length: 2500 })
    message: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    timestamp: Date;

}
  