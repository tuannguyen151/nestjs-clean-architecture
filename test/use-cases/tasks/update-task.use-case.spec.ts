import { Test, type TestingModule } from '@nestjs/testing'

import { type TaskEntity } from '@domain/entities/task.entity'
import { IException } from '@domain/exceptions/exceptions.interface'
import { ITaskRepository } from '@domain/repositories/task.repository.interface'

import { UpdateTaskUseCase } from '@use-cases/tasks/update-task.use-case'

describe('UpdateTaskUseCase', () => {
  let updateTaskUseCase: UpdateTaskUseCase
  let taskRepository: ITaskRepository
  let exceptionsService: IException

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTaskUseCase,
        {
          provide: ITaskRepository,
          useValue: {
            findOneTask: jest.fn(),
            updateTask: jest.fn(),
          },
        },
        {
          provide: IException,
          useValue: {
            notFoundException: jest.fn(),
          },
        },
      ],
    }).compile()

    updateTaskUseCase = moduleRef.get<UpdateTaskUseCase>(UpdateTaskUseCase)
    taskRepository = moduleRef.get<ITaskRepository>(ITaskRepository)
    exceptionsService = moduleRef.get<IException>(IException)
    ;(
      exceptionsService.notFoundException as unknown as jest.Mock
    ).mockImplementation((data: { message: string }) => {
      throw new Error(data.message)
    })
  })

  describe('execute', () => {
    it('should update the task and return true', async () => {
      const params = { id: 1, userId: 123 }
      const taskPayload: Partial<TaskEntity> = { title: 'New Title' }
      jest
        .spyOn(taskRepository, 'findOneTask')
        .mockResolvedValueOnce({} as TaskEntity)
      jest.spyOn(taskRepository, 'updateTask').mockResolvedValueOnce(true)

      const result = await updateTaskUseCase.execute(params, taskPayload)

      expect(taskRepository.findOneTask).toHaveBeenCalledWith(params)
      expect(taskRepository.updateTask).toHaveBeenCalledWith(
        params,
        taskPayload,
      )
      expect(result).toBe(true)
    })

    it('should throw a not found exception if the task does not exist', async () => {
      const params = { id: 1, userId: 123 }
      const taskPayload: Partial<TaskEntity> = { title: 'New Title' }

      jest.spyOn(taskRepository, 'findOneTask').mockResolvedValueOnce(null)
      jest.spyOn(exceptionsService, 'notFoundException')

      await expect(
        updateTaskUseCase.execute(params, taskPayload),
      ).rejects.toThrow('Task not found')

      expect(taskRepository.findOneTask).toHaveBeenCalledWith(params)
      expect(exceptionsService.notFoundException).toHaveBeenCalledWith({
        type: 'TaskNotFoundException',
        message: 'Task not found',
      })
    })
  })
})
