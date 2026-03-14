import { Inject, Injectable } from '@nestjs/common'

import { TaskEntity } from '@domain/entities/task.entity'
import {
  ISearchTasksParams,
  ITaskRepository,
} from '@domain/repositories/task.repository.interface'

@Injectable()
export class GetListTasksUseCase {
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(
    queryParams: ISearchTasksParams & { userId?: number },
  ): Promise<TaskEntity[]> {
    return await this.taskRepository.findTasks(queryParams)
  }
}
