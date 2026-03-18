import {
  TaskEntity,
  TaskPriorityEnum,
  TaskStatusEnum,
} from '@domain/entities/task.entity'

export const createTaskStub = (
  overrides: Partial<{ userId: number; status: TaskStatusEnum }> = {},
): TaskEntity => {
  const now = new Date()
  return new TaskEntity(
    1,
    overrides.userId ?? 1,
    'Task 1',
    overrides.status ?? TaskStatusEnum.Completed,
    TaskPriorityEnum.Medium,
    now,
    now,
    'Description 1',
    now,
  )
}
