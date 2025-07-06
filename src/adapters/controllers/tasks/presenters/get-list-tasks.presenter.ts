import { ApiProperty } from '@nestjs/swagger'

import { TaskStatusEnum } from '@domain/entities/task.entity'
import { TaskPriorityEnum } from '@domain/enums/task-priority.enum'

export class GetListTasksPresenter {
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

  constructor({
    id,
    title,
    status,
    priority,
    description,
    dueDate,
  }: GetListTasksPresenter) {
    this.id = id
    this.title = title
    this.status = status
    this.priority = priority
    this.description = description
    this.dueDate = dueDate
  }
}
