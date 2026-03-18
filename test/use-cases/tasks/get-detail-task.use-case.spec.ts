import { Test, type TestingModule } from '@nestjs/testing'

import { createTaskStub } from 'test/stubs/task.stub'

import { IException } from '@domain/exceptions/exceptions.interface'
import { ITaskRepository } from '@domain/repositories/task.repository.interface'

import { GetDetailTaskUseCase } from '@use-cases/tasks/get-detail-task.use-case'

describe('GetDetailTaskUseCase', () => {
  let useCase: GetDetailTaskUseCase
  let taskRepository: ITaskRepository
  let exceptionsService: IException

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetDetailTaskUseCase,
        {
          provide: ITaskRepository,
          useValue: {
            findOneTask: jest.fn(),
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

    useCase = module.get<GetDetailTaskUseCase>(GetDetailTaskUseCase)
    taskRepository = module.get<ITaskRepository>(ITaskRepository)
    exceptionsService = module.get<IException>(IException)
    ;(
      exceptionsService.notFoundException as unknown as jest.Mock
    ).mockImplementation((data: { message: string }) => {
      throw new Error(data.message)
    })
  })

  describe('execute', () => {
    it('should return the task when found', async () => {
      const payload = { id: 1, userId: 1 }
      const task = createTaskStub()
      jest.spyOn(taskRepository, 'findOneTask').mockResolvedValue(task)

      const result = await useCase.execute(payload)

      expect(taskRepository.findOneTask).toHaveBeenCalledWith(payload)
      expect(result).toEqual(task)
      expect(exceptionsService.notFoundException).not.toHaveBeenCalled()
    })

    it('should throw an exception when task is not found', async () => {
      const payload = { id: 1, userId: 123 }

      jest.spyOn(taskRepository, 'findOneTask').mockResolvedValue(null)

      await expect(useCase.execute(payload)).rejects.toThrow('Task not found')
      expect(taskRepository.findOneTask).toHaveBeenCalledWith(payload)
      expect(exceptionsService.notFoundException).toHaveBeenCalledWith({
        type: 'TaskNotFoundException',
        message: 'Task not found',
      })
    })
  })
})
