import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { createTaskStub } from 'test/stubs/task.stub'
import { Repository, UpdateResult } from 'typeorm'

import { TaskStatusEnum } from '@domain/entities/task.entity'

import { Task } from '@infrastructure/databases/postgresql/entities/task.entity'
import { TaskRepository } from '@infrastructure/databases/postgresql/repositories/task.repository'

describe('TaskRepository', () => {
  let taskRepository: TaskRepository
  let taskEntityRepository: Repository<Task>

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TaskRepository,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
      ],
    }).compile()

    taskRepository = moduleRef.get<TaskRepository>(TaskRepository)
    taskEntityRepository = moduleRef.get<Repository<Task>>(
      getRepositoryToken(Task),
    )
  })

  describe('findTasks', () => {
    it('should return an array of tasks', async () => {
      const stub = createTaskStub()
      const mockTasks = [stub] as unknown as Task[]
      const mockParams = {
        size: 10,
        status: TaskStatusEnum.Completed,
        userId: 123,
      }

      jest.spyOn(taskEntityRepository, 'find').mockResolvedValueOnce(mockTasks)

      const result = await taskRepository.findTasks(mockParams)

      expect(result).toEqual([stub])
      expect(taskEntityRepository.find).toHaveBeenCalledWith({
        where: {
          userId: mockParams.userId,
          status: mockParams.status,
        },
        select: ['id', 'title', 'status', 'priority', 'description', 'dueDate'],
        take: mockParams.size,
        order: {
          id: 'DESC',
        },
      })
    })
  })

  describe('createTask', () => {
    it('should create a new task', async () => {
      const stub = createTaskStub()
      const mockTask: Partial<Task> = {
        title: 'Task title',
      }

      jest
        .spyOn(taskEntityRepository, 'create')
        .mockReturnValueOnce(stub as unknown as Task)
      jest
        .spyOn(taskEntityRepository, 'save')
        .mockResolvedValueOnce(stub as unknown as Task)

      const result = await taskRepository.createTask(mockTask)

      expect(result).toEqual(stub)
      expect(taskEntityRepository.create).toHaveBeenCalledWith(mockTask)
      expect(taskEntityRepository.save).toHaveBeenCalledWith(stub)
    })
  })

  describe('findOneTask', () => {
    it('should return a task', async () => {
      const stub = createTaskStub()
      const mockTask = stub as unknown as Task
      const mockParams = {
        id: 1,
        userId: 123,
      }

      jest
        .spyOn(taskEntityRepository, 'findOne')
        .mockResolvedValueOnce(mockTask)

      const result = await taskRepository.findOneTask(mockParams)

      expect(result).toEqual(stub)
      expect(taskEntityRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: mockParams.id,
          userId: mockParams.userId,
        },
      })
    })
  })

  describe('updateTask', () => {
    it('should update a task', async () => {
      const mockParams = {
        id: 1,
        userId: 123,
      }
      const mockTask: Partial<Task> = {
        description: 'Test description',
      }

      jest
        .spyOn(taskEntityRepository, 'update')
        .mockResolvedValueOnce({ affected: 1 } as UpdateResult)

      const result = await taskRepository.updateTask(mockParams, mockTask)

      expect(result).toEqual(true)
      expect(taskEntityRepository.update).toHaveBeenCalledWith(
        {
          id: mockParams.id,
          userId: mockParams.userId,
        },
        mockTask,
      )
    })

    it('should return false if task is not found', async () => {
      const mockParams = {
        id: 1,
        userId: 123,
      }
      const mockTask: Partial<Task> = {
        description: 'Test description',
      }

      jest
        .spyOn(taskEntityRepository, 'update')
        .mockResolvedValueOnce({ affected: 0 } as UpdateResult)

      const result = await taskRepository.updateTask(mockParams, mockTask)

      expect(result).toEqual(false)
      expect(taskEntityRepository.update).toHaveBeenCalledWith(
        {
          id: mockParams.id,
          userId: mockParams.userId,
        },
        mockTask,
      )
    })
  })

  describe('countTasks', () => {
    it('should return the number of tasks', async () => {
      const mockParams = {
        userId: 123,
        status: TaskStatusEnum.Completed,
      }

      jest.spyOn(taskEntityRepository, 'count').mockResolvedValueOnce(10)

      const result = await taskRepository.countTasks(mockParams)

      expect(result).toEqual(10)
      expect(taskEntityRepository.count).toHaveBeenCalledWith({
        where: {
          userId: mockParams.userId,
          status: mockParams.status,
        },
      })
    })
  })
})
