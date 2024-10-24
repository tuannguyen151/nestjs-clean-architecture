import { Inject, Injectable } from '@nestjs/common'
import { TaskEntity } from 'src/domain/entities/task.entity'
import {
  EXCEPTIONS,
  IException,
} from 'src/domain/exceptions/exceptions.interface'
import {
  TASK_REPOSITORY,
  ITaskRepositoryInterface,
} from 'src/domain/repositories/task.repository.interface'

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepositoryInterface,
    @Inject(EXCEPTIONS)
    private readonly exceptionsService: IException,
  ) {}

  async execute(
    params: { id: number; userId: string },
    taskPayload: Partial<TaskEntity>,
  ): Promise<boolean> {
    await this.checkTaskExistence(params)

    return await this.taskRepository.updateTask(params, taskPayload)
  }

  private async checkTaskExistence(params: {
    id: number
    userId: string
  }): Promise<void> {
    const task = await this.taskRepository.findOnTask(params)

    if (!task) {
      this.exceptionsService.notFoundException({
        type: 'TaskNotFoundException',
        message: 'Task not found',
      })
    }
  }
}
