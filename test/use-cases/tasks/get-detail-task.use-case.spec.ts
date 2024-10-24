import { Test, TestingModule } from '@nestjs/testing'
import {
  TASK_REPOSITORY,
  ITaskRepositoryInterface,
} from 'src/domain/repositories/task.repository.interface'
import {
  EXCEPTIONS,
  IException,
} from 'src/domain/exceptions/exceptions.interface'
import { createTaskStub } from 'test/stubs/task.stub'

import { GetDetailTaskUseCase } from 'src/use-cases/tasks/get-detail-task.use-case'

describe('GetDetailTaskUseCase', () => {
  let useCase: GetDetailTaskUseCase
  let taskRepository: ITaskRepositoryInterface
  let exceptionsService: IException

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetDetailTaskUseCase,
        {
          provide: TASK_REPOSITORY,
          useValue: {
            findOnTask: jest.fn(),
          },
        },
        {
          provide: EXCEPTIONS,
          useValue: {
            notFoundException: jest.fn(),
          },
        },
      ],
    }).compile()

    useCase = module.get<GetDetailTaskUseCase>(GetDetailTaskUseCase)
    taskRepository = module.get<ITaskRepositoryInterface>(TASK_REPOSITORY)
    exceptionsService = module.get<IException>(EXCEPTIONS)
  })

  describe('execute', () => {
    it('should return the task when found', async () => {
      const payload = { id: 1, userId: 'user123' }
      const task = createTaskStub()

      jest.spyOn(taskRepository, 'findOnTask').mockResolvedValue(task)

      const result = await useCase.execute(payload)

      expect(result).toEqual(task)
      expect(taskRepository.findOnTask).toHaveBeenCalledWith(payload)
      expect(exceptionsService.notFoundException).not.toHaveBeenCalled()
    })

    it('should throw an exception when task is not found', async () => {
      const payload = { id: 1, userId: 'user123' }

      jest.spyOn(taskRepository, 'findOnTask').mockResolvedValue(null)

      expect(await useCase.execute(payload)).toBeNull()
      expect(taskRepository.findOnTask).toHaveBeenCalledWith(payload)
      expect(exceptionsService.notFoundException).toHaveBeenCalledWith({
        type: 'TaskNotFoundException',
        message: 'Task not found',
      })
    })
  })
})
