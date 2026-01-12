import { Inject, Injectable } from '@nestjs/common'

import { TaskEntity, TaskPriorityEnum } from '@domain/entities/task.entity'
import { ITaskRepository } from '@domain/repositories/task.repository.interface'

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
  ) {}

  execute(
    dto: Pick<TaskEntity, 'title' | 'description' | 'dueDate'> & {
      priority?: TaskPriorityEnum
    },
    userId: number,
  ): Promise<TaskEntity> {
    return this.taskRepository.createTask({
      ...dto,
      userId,
      priority: dto.priority ?? TaskPriorityEnum.Medium, // Set default priority to Medium if not provided
    })
  }
}
