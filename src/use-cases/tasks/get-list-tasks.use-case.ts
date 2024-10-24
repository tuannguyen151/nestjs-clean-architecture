import { Inject, Injectable } from '@nestjs/common'
import {
  ISearchTasksParams,
  TASK_REPOSITORY,
  ITaskRepositoryInterface,
} from 'src/domain/repositories/task.repository.interface'
import { TaskEntity } from 'src/domain/entities/task.entity'

@Injectable()
export class GetListTasksUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepositoryInterface,
  ) {}

  async execute(
    queryParams: ISearchTasksParams & { userId: string },
  ): Promise<TaskEntity[]> {
    return await this.taskRepository.findTasks(queryParams)
  }
}
