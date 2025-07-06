import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { In, Repository } from 'typeorm'

import {
  ICountTasksParams,
  ISearchTasksParams,
  ITaskRepositoryInterface,
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

@Injectable()
export class TaskRepository implements ITaskRepositoryInterface {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findTasks({
    size,
    status,
    priority,
    userId,
  }: ISearchTasksParams & { userId: number }): Promise<Task[]> {
    const whereCondition: ITaskWhereCondition = {
      userId: userId,
    }

    if (status !== undefined) {
      whereCondition.status = status
    }

    if (priority !== undefined) {
      // Handle both single priority value and array of priorities
      if (Array.isArray(priority)) {
        whereCondition.priority = In(priority)
      } else {
        whereCondition.priority = priority
      }
    }

    const tasks = await this.taskRepository.find({
      where: whereCondition,
      select: DEFAULT_SELECT_FIELDS,
      take: size,
      order: {
        id: 'DESC',
      },
    })

    return tasks
  }

  async createTask(task: Partial<Task>): Promise<Task> {
    const newTask = this.taskRepository.create(task)
    await this.taskRepository.save(newTask)

    return newTask
  }

  async findOnTask({
    id,
    userId,
  }: {
    id: number
    userId: number
  }): Promise<Task | null> {
    return await this.taskRepository.findOne({
      where: {
        id: id,
        userId: userId,
      },
    })
  }

  async updateTask(
    {
      id,
      userId,
    }: {
      id: number
      userId: number
    },
    task: Partial<Task>,
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
    const whereCondition: ITaskWhereCondition = {
      userId: userId,
    }

    if (status !== undefined) {
      whereCondition.status = status
    }

    if (priority !== undefined) {
      // Handle both single priority value and array of priorities
      if (Array.isArray(priority)) {
        whereCondition.priority = In(priority)
      } else {
        whereCondition.priority = priority
      }
    }

    return await this.taskRepository.count({
      where: whereCondition,
    })
  }
}
