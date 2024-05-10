import {Entity, PrimaryColumn, ManyToOne, PrimaryGeneratedColumn, BaseEntity} from 'typeorm';

@Entity()
export class UserRoles extends BaseEntity {
  @PrimaryGeneratedColumn()
  user_role_id: number;

  @PrimaryColumn({})
  userId: number;

  @PrimaryColumn({ })
  roleId: number;

}