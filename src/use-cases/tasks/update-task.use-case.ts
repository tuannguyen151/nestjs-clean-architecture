import { Inject, Injectable } from '@nestjs/common'

import { TaskEntity } from '@domain/entities/task.entity'
import { IException } from '@domain/exceptions/exceptions.interface'
import { ITaskRepository } from '@domain/repositories/task.repository.interface'

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
    @Inject(IException)
    private readonly exceptionsService: IException,
  ) {}

  async execute(
    params: { id: number; userId: number },
    dto: Partial<
      Pick<
        TaskEntity,
        'title' | 'description' | 'dueDate' | 'priority' | 'status'
      >
    >,
  ): Promise<boolean> {
    await this.checkTaskExistence(params)

    return await this.taskRepository.updateTask(params, dto)
  }

  private async checkTaskExistence(params: {
    id: number
    userId: number
  }): Promise<void> {
    const task = await this.taskRepository.findOneTask(params)

    if (!task) {
      this.exceptionsService.notFoundException({
        type: 'TaskNotFoundException',
        message: 'Task not found',
      })
    }
  }
}
