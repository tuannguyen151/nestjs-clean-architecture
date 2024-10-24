import { Inject, Injectable } from '@nestjs/common'
import {
  TASK_REPOSITORY,
  ITaskRepositoryInterface,
} from 'src/domain/repositories/task.repository.interface'
import { TaskEntity } from 'src/domain/entities/task.entity'
import {
  EXCEPTIONS,
  IException,
} from 'src/domain/exceptions/exceptions.interface'

@Injectable()
export class GetDetailTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepositoryInterface,
    @Inject(EXCEPTIONS)
    private readonly exceptionsService: IException,
  ) {}

  async execute(payload: { id: number; userId: string }): Promise<TaskEntity> {
    const task = await this.taskRepository.findOnTask(payload)

    if (!task) {
      this.exceptionsService.notFoundException({
        type: 'TaskNotFoundException',
        message: 'Task not found',
      })
    }

    return task
  }
}
