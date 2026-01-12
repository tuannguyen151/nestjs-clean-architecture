import { Inject, Injectable } from '@nestjs/common'

import { IException } from '@domain/exceptions/exceptions.interface'
import { ITaskRepository } from '@domain/repositories/task.repository.interface'

@Injectable()
export class GetDetailTaskUseCase {
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
    @Inject(IException)
    private readonly exceptionsService: IException,
  ) {}

  async execute(payload: { id: number; userId: number }) {
    const task = await this.taskRepository.findOneTask(payload)

    if (!task) {
      this.exceptionsService.notFoundException({
        type: 'TaskNotFoundException',
        message: 'Task not found',
      })
    }

    return task
  }
}
