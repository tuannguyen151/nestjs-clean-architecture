import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { UserEntity } from '@domain/entities/user.entity'

@Entity('users')
@Index('IDX_users_username', ['username'], { unique: true })
export class User implements UserEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    primaryKeyConstraintName: 'PK_users_id',
  })
  public readonly id!: number

  @Column('varchar', { length: 255 })
  public username!: string

  @Column('text')
  password!: string

  @Column('timestamp', { name: 'last_login', nullable: true })
  public lastLogin?: Date

  @CreateDateColumn({ name: 'created_at' })
  public readonly createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public readonly updatedAt!: Date
}
