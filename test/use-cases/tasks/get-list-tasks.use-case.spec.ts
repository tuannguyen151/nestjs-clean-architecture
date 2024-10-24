import { Test } from '@nestjs/testing'
import {
  TASK_REPOSITORY,
  ITaskRepositoryInterface,
} from 'src/domain/repositories/task.repository.interface'
import { TaskEntity } from 'src/domain/entities/task.entity'

import { GetListTasksUseCase } from 'src/use-cases/tasks/get-list-tasks.use-case'
import { createTaskStub } from 'test/stubs/task.stub'

describe('GetListTasksUseCase', () => {
  let getListTasksUseCase: GetListTasksUseCase
  let taskRepository: ITaskRepositoryInterface

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetListTasksUseCase,
        {
          provide: TASK_REPOSITORY,
          useValue: {
            findTasks: jest.fn(),
          },
        },
      ],
    }).compile()

    getListTasksUseCase =
      moduleRef.get<GetListTasksUseCase>(GetListTasksUseCase)
    taskRepository = moduleRef.get<ITaskRepositoryInterface>(TASK_REPOSITORY)
  })

  describe('execute', () => {
    it('should return a list of tasks', async () => {
      const queryParams = { userId: '123' }
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
