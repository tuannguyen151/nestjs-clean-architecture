import { Test } from '@nestjs/testing'

import { createTaskStub } from 'test/stubs/task.stub'

import { TaskEntity } from '@domain/entities/task.entity'
import { ITaskRepository } from '@domain/repositories/task.repository.interface'

import { GetListTasksUseCase } from '@use-cases/tasks/get-list-tasks.use-case'

describe('GetListTasksUseCase', () => {
  let getListTasksUseCase: GetListTasksUseCase
  let taskRepository: ITaskRepository

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetListTasksUseCase,
        {
          provide: ITaskRepository,
          useValue: {
            findTasks: jest.fn(),
          },
        },
      ],
    }).compile()

    getListTasksUseCase =
      moduleRef.get<GetListTasksUseCase>(GetListTasksUseCase)
    taskRepository = moduleRef.get<ITaskRepository>(ITaskRepository)
  })

  describe('execute', () => {
    it('should return a list of tasks', async () => {
      const queryParams = { userId: 123 }
      const expectedTasks: TaskEntity[] = [createTaskStub()]

      jest
        .spyOn(taskRepository, 'findTasks')
        .mockResolvedValueOnce(expectedTasks)

      const result = await getListTasksUseCase.execute(queryParams)

      expect(result).toEqual(expectedTasks)
      expect(taskRepository.findTasks).toHaveBeenCalledWith(queryParams)
    })
  })
})
