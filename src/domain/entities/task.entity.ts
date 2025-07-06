import { TaskPriorityEnum } from '../enums/task-priority.enum'

export enum TaskStatusEnum {
  Completed = 2,
  OnGoing = 3,
}

export class TaskEntity {
  public readonly id!: number
  public userId!: number
  public title!: string
  public description?: string
  public status!: TaskStatusEnum
  public priority!: TaskPriorityEnum
  public dueDate?: Date
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}
