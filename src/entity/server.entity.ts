import {
    BaseEntity,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from "typeorm";

  @Entity()
  export class server_uptime extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    initiated_timestamp: Date;
  }
  