import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { TaskEntity, TaskStatusEnum } from '@domain/entities/task.entity'
import { TaskPriorityEnum } from '@domain/enums/task-priority.enum'

@Entity('tasks')
@Index('IDX_tasks_user_id', ['userId'])
export class Task implements TaskEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    primaryKeyConstraintName: 'PK_tasks_id',
  })
  public readonly id!: number

  @Column('bigint', { name: 'user_id' })
  public userId!: number

  @Column('varchar', { length: 255 })
  public title!: string

  @Column('text', { nullable: true })
  public description?: string

  @Column('smallint', { default: TaskStatusEnum.OnGoing })
  public status!: TaskStatusEnum

  @Column('smallint', { default: TaskPriorityEnum.Medium })
  public priority!: TaskPriorityEnum

  @Column('timestamp', { name: 'due_date', nullable: true })
  public dueDate?: Date

  @CreateDateColumn({ name: 'created_at' })
  public readonly createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public readonly updatedAt!: Date
}
