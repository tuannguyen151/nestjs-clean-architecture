import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { In, Repository } from 'typeorm'

import { TaskEntity } from '@domain/entities/task.entity'
import {
  ICountTasksParams,
  ISearchTasksParams,
  ITaskRepository,
} from '@domain/repositories/task.repository.interface'

import { Task } from '../entities/task.entity'

const DEFAULT_SELECT_FIELDS: (keyof Task)[] = [
  'id',
  'title',
  'status',
  'priority',
  'description',
  'dueDate',
]

interface ITaskWhereCondition {
  userId: number
  status?: Task['status']
  priority?: Task['priority'] | ReturnType<typeof In>
}

interface IWhereConditionParams {
  userId: number
  status?: Task['status']
  priority?: Task['priority'] | Task['priority'][]
}

@Injectable()
export class TaskRepository implements ITaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findTasks({
    size,
    status,
    priority,
    userId,
  }: ISearchTasksParams & { userId: number }): Promise<TaskEntity[]> {
    const tasks = await this.taskRepository.find({
      where: this.buildWhereCondition({ userId, status, priority }),
      select: DEFAULT_SELECT_FIELDS,
      take: size,
      order: { id: 'DESC' },
    })

    return tasks.map((task) => this.toEntity(task))
  }

  async createTask(task: Partial<TaskEntity>): Promise<TaskEntity> {
    const newTask = this.taskRepository.create(task)
    const taskCreated = await this.taskRepository.save(newTask)
    return this.toEntity(taskCreated)
  }

  async findOneTask({
    id,
    userId,
  }: {
    id: number
    userId: number
  }): Promise<TaskEntity | null> {
    const task = await this.taskRepository.findOne({
      where: { id, userId },
    })
    if (!task) return null
    return this.toEntity(task)
  }

  async updateTask(
    {
      id,
      userId,
    }: {
      id: number
      userId: number
    },
    task: Partial<TaskEntity>,
  ): Promise<boolean> {
    const updatedTask = await this.taskRepository.update(
      {
        id: id,
        userId: userId,
      },
      task,
    )

    if (updatedTask.affected === 0) return false

    return true
  }

  async countTasks({
    userId,
    status,
    priority,
  }: ICountTasksParams & { userId: number }): Promise<number> {
    return await this.taskRepository.count({
      where: this.buildWhereCondition({ userId, status, priority }),
    })
  }

  private toEntity(task: Task): TaskEntity {
    return new TaskEntity(
      task.id,
      task.userId,
      task.title,
      task.status,
      task.priority,
      task.createdAt,
      task.updatedAt,
      task.description,
      task.dueDate,
    )
  }

  private buildWhereCondition({
    userId,
    status,
    priority,
  }: IWhereConditionParams): ITaskWhereCondition {
    const whereCondition: ITaskWhereCondition = { userId }

    if (status !== undefined) {
      whereCondition.status = status
    }

    if (priority !== undefined) {
      whereCondition.priority = Array.isArray(priority)
        ? In(priority)
        : priority
    }

    return whereCondition
  }
}
