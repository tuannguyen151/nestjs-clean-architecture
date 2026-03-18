import { type TaskEntity } from '@domain/entities/task.entity'

import { GetDetailTaskPresenter } from './get-detail-task.presenter'

export class GetListTasksPresenter extends GetDetailTaskPresenter {
  static fromList(tasks: TaskEntity[]): GetDetailTaskPresenter[] {
    return tasks.map((task) => new GetDetailTaskPresenter(task))
  }
}
