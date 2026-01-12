import { Inject, Injectable } from '@nestjs/common'

import {
  ICountTasksParams,
  ITaskRepository,
} from '@domain/repositories/task.repository.interface'

@Injectable()
export class CountTasksUseCase {
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(
    params: ICountTasksParams & { userId: number },
  ): Promise<number> {
    return await this.taskRepository.countTasks(params)
  }
}
