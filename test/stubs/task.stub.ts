import {
  TaskEntity,
  TaskPriorityEnum,
  TaskStatusEnum,
} from '@domain/entities/task.entity'

export const createTaskStub = (): TaskEntity => {
  const now = new Date()
  return new TaskEntity(
    1,
    1,
    'Task 1',
    TaskStatusEnum.Completed,
    TaskPriorityEnum.Medium,
    now,
    now,
    'Description 1',
    now,
  )
}
