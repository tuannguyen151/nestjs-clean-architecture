import { Test, TestingModule } from '@nestjs/testing'

import { createTaskStub } from 'test/stubs/task.stub'

import { TaskPriorityEnum } from '@domain/entities/task.entity'
import { ITaskRepository } from '@domain/repositories/task.repository.interface'

import { CreateTaskUseCase } from '@use-cases/tasks/create-task.use-case'

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase
  let taskRepository: ITaskRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTaskUseCase,
        {
          provide: ITaskRepository,
          useValue: {
            createTask: jest.fn(),
          },
        },
      ],
    }).compile()

    useCase = module.get<CreateTaskUseCase>(CreateTaskUseCase)
    taskRepository = module.get<ITaskRepository>(ITaskRepository)
  })

  it('should create a task', async () => {
    const userId = 1
    const taskPayload = { title: 'Task 1' }
    const createdTask = createTaskStub()

    jest.spyOn(taskRepository, 'createTask').mockResolvedValueOnce(createdTask)

    const result = await useCase.execute(taskPayload, userId)

    expect(taskRepository.createTask).toHaveBeenCalledWith({
      ...taskPayload,
      userId,
      priority: TaskPriorityEnum.Medium,
    })
    expect(result).toEqual(createdTask)
  })
})
