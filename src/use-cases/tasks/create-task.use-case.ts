import { Inject, Injectable } from '@nestjs/common'

import { TaskEntity } from '@domain/entities/task.entity'
import { TaskPriorityEnum } from '@domain/enums/task-priority.enum'
import {
  ITaskRepositoryInterface,
  TASK_REPOSITORY,
} from '@domain/repositories/task.repository.interface'

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepositoryInterface,
  ) {}

  async execute(task: Partial<TaskEntity>): Promise<TaskEntity> {
    // Set default priority to Medium if not provided
    const taskWithDefaults = {
      ...task,
      priority: task.priority ?? TaskPriorityEnum.Medium,
    }

    return await this.taskRepository.createTask(taskWithDefaults)
  }
}
