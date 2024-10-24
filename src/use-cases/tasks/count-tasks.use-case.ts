import { Injectable, Inject } from '@nestjs/common'
import {
  TASK_REPOSITORY,
  ITaskRepositoryInterface,
  ICountTasksParams,
} from 'src/domain/repositories/task.repository.interface'

@Injectable()
export class CountTasksUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepositoryInterface,
  ) {}

  async execute(
    params: ICountTasksParams & { userId: string },
  ): Promise<number> {
    return await this.taskRepository.countTasks(params)
  }
}
