import { Test } from '@nestjs/testing'

import { ITaskRepository } from '@domain/repositories/task.repository.interface'

import { CountTasksUseCase } from '@use-cases/tasks/count-tasks.use-case'

describe('CountTasksUseCase', () => {
  let countTasksUseCase: CountTasksUseCase
  let taskRepository: ITaskRepository

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CountTasksUseCase,
        {
          provide: ITaskRepository,
          useValue: {
            countTasks: jest.fn(),
          },
        },
      ],
    }).compile()

    countTasksUseCase = moduleRef.get<CountTasksUseCase>(CountTasksUseCase)
    taskRepository = moduleRef.get<ITaskRepository>(ITaskRepository)
  })

  describe('execute', () => {
    it('should call taskRepository.countTasks with the correct params', async () => {
      const params = {
        userId: 1,
      }

      await countTasksUseCase.execute(params)

      expect(taskRepository.countTasks).toHaveBeenCalledWith(params)
    })

    it('should return the result from taskRepository.countTasks', async () => {
      const params = {
        userId: 1,
      }
      const expectedResult = 5
      ;(taskRepository.countTasks as jest.Mock).mockResolvedValue(
        expectedResult,
      )

      const result = await countTasksUseCase.execute(params)

      expect(result).toEqual(expectedResult)
    })
  })
})
