import { ApiProperty } from '@nestjs/swagger'

import {
  TaskEntity,
  TaskPriorityEnum,
  TaskStatusEnum,
} from '@domain/entities/task.entity'

export class GetDetailTaskPresenter {
  @ApiProperty()
  id: number

  @ApiProperty()
  title: string

  @ApiProperty({
    required: true,
    enum: TaskStatusEnum,
    description: '2: Completed, 3: OnGoing',
  })
  status: TaskStatusEnum

  @ApiProperty({
    required: true,
    enum: TaskPriorityEnum,
    description: 'Task priority: 1: Low, 2: Medium, 3: High, 4: Urgent',
  })
  priority: TaskPriorityEnum

  @ApiProperty({ required: false })
  description?: string

  @ApiProperty({ required: false })
  dueDate?: Date

  constructor(task: TaskEntity) {
    this.id = task.id
    this.title = task.title
    this.status = task.status
    this.priority = task.priority
    this.description = task.description
    this.dueDate = task.dueDate
  }
}
