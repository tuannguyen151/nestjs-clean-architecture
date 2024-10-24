import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Task } from '../entities/task.entity'
import {
  ICountTasksParams,
  ISearchTasksParams,
  ITaskRepositoryInterface,
} from 'src/domain/repositories/task.repository.interface'

const DEFAULT_SELECT_FIELDS: (keyof Task)[] = [
  'id',
  'title',
  'status',
  'description',
  'dueDate',
]

@Injectable()
export class TaskRepository implements ITaskRepositoryInterface {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findTasks({
    size,
    status,
    userId,
  }: ISearchTasksParams & { userId: string }): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      where: {
        userId: userId,
        status: status,
      },
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
    userId: string
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
      userId: string
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
  }: ICountTasksParams & { userId: string }): Promise<number> {
    return await this.taskRepository.count({
      where: {
        userId: userId,
        status: status,
      },
    })
  }
}
