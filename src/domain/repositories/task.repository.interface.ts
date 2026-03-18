import {
  type TaskEntity,
  type TaskPriorityEnum,
  type TaskStatusEnum,
} from '../entities/task.entity'

export interface ISearchTasksParams {
  status?: TaskStatusEnum
  priority?: TaskPriorityEnum | TaskPriorityEnum[]
  size?: number
}

export interface ICountTasksParams {
  status?: TaskStatusEnum
  priority?: TaskPriorityEnum | TaskPriorityEnum[]
}

export const ITaskRepository = Symbol('ITaskRepository')
export interface ITaskRepository {
  findTasks(
    payload: ISearchTasksParams & { userId?: number },
  ): Promise<TaskEntity[]>
  createTask(task: Partial<TaskEntity>): Promise<TaskEntity>
  findOneTask(payload: {
    id: number
    userId: number
  }): Promise<TaskEntity | null>
  updateTask(
    params: {
      id: number
      userId: number
    },
    task: Partial<TaskEntity>,
  ): Promise<boolean>
  countTasks(params: ICountTasksParams & { userId?: number }): Promise<number>
}
