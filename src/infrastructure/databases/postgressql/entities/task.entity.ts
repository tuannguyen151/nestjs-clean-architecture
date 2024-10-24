import {
  TaskEntity,
  TaskStatusEnum,
} from '../../../../domain/entities/task.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('tasks')
export class Task implements TaskEntity {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column('varchar', { name: 'user_id', length: 255 })
  public userId: string

  @Column('varchar', { length: 255 })
  public title: string

  @Column('text', { nullable: true })
  public description?: string

  @Column('smallint', { default: TaskStatusEnum.OnGoing })
  public status: TaskStatusEnum

  @Column('timestamp', { name: 'due_date', nullable: true })
  public dueDate?: Date

  @CreateDateColumn({ name: 'created_at' })
  public readonly createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public readonly updatedAt: Date
}
