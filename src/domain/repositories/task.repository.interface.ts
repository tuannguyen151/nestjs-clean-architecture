import { TaskEntity, TaskStatusEnum } from '../entities/task.entity'

export interface ISearchTasksParams {
  status?: TaskStatusEnum
  size?: number
}

export interface ICountTasksParams {
  status?: TaskStatusEnum
}

export const TASK_REPOSITORY = 'TaskRepositoryInterface'
export interface ITaskRepositoryInterface {
  findTasks(
    payload: ISearchTasksParams & { userId: string },
  ): Promise<TaskEntity[]>
  createTask(task: Partial<TaskEntity>): Promise<TaskEntity>
  findOnTask(payload: {
    id: number
    userId: string
  }): Promise<TaskEntity | null>
  updateTask(
    params: {
      id: number
      userId: string
    },
    task: Partial<TaskEntity>,
  ): Promise<boolean>
  countTasks(params: ICountTasksParams & { userId: string }): Promise<number>
}
