# Layer Code Examples

Concrete TypeScript examples for each layer in the NestJS Clean Architecture project.

---

## 1. Domain Entity

```typescript
// src/domain/entities/task.entity.ts
export enum TaskPriorityEnum {
  Low = 1,
  Medium = 2,
  High = 3,
  Urgent = 4,
}

export enum TaskStatusEnum {
  Completed = 2,
  OnGoing = 3,
}

export class TaskEntity {
  constructor(
    public readonly id: number, // readonly – cannot be changed after creation
    public userId: number,
    public title: string,
    private _status: TaskStatusEnum, // private – controlled via method
    public priority: TaskPriorityEnum,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public description?: string,
    public dueDate?: Date,
  ) {}

  get status(): TaskStatusEnum {
    return this._status
  }

  complete(): void {
    if (this.status !== TaskStatusEnum.OnGoing) {
      throw new Error('Only ongoing tasks can be marked as completed.')
    }
    this._status = TaskStatusEnum.Completed
  }
}
```

**Entity rules:**

- `readonly` for `id`, `createdAt`, `updatedAt`
- `private _field` with getter if there is a business rule
- Methods for state transitions (e.g., `complete()`, `cancel()`)

---

## 2. Repository Interface

```typescript
// src/domain/repositories/task.repository.interface.ts
import {
  TaskEntity,
  TaskPriorityEnum,
  TaskStatusEnum,
} from '../entities/task.entity'

export interface ISearchTasksParams {
  status?: TaskStatusEnum
  priority?: TaskPriorityEnum | TaskPriorityEnum[]
  size?: number
}

export interface ICountTasksParams {
  status?: TaskStatusEnum
  priority?: TaskPriorityEnum | TaskPriorityEnum[]
}

export const ITaskRepository = Symbol('ITaskRepository')
export interface ITaskRepository {
  findTasks(
    payload: ISearchTasksParams & { userId: number },
  ): Promise<TaskEntity[]>
  createTask(task: Partial<TaskEntity>): Promise<TaskEntity>
  findOneTask(payload: {
    id: number
    userId: number
  }): Promise<TaskEntity | null>
  updateTask(
    params: { id: number; userId: number },
    task: Partial<TaskEntity>,
  ): Promise<boolean>
  countTasks(params: ICountTasksParams & { userId: number }): Promise<number>
}
```

**Repository interface rules:**

- Export both `Symbol` and `interface` with the same name for use with `@Inject()`
- Only accept/return domain entities (`TaskEntity`), never TypeORM entities
- Place in `src/domain/repositories/`

---

## 3. Use Case

```typescript
// src/use-cases/tasks/create-task.use-case.ts
import { Inject, Injectable } from '@nestjs/common'

import { TaskEntity, TaskPriorityEnum } from '@domain/entities/task.entity'
import { ITaskRepository } from '@domain/repositories/task.repository.interface'

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
  ) {}

  execute(
    dto: Pick<TaskEntity, 'title' | 'description' | 'dueDate'> & {
      priority?: TaskPriorityEnum
    },
    userId: number,
  ): Promise<TaskEntity> {
    return this.taskRepository.createTask({
      ...dto,
      userId,
      priority: dto.priority ?? TaskPriorityEnum.Medium,
    })
  }
}
```

**Use case rules:**

- One file = one use case (one `@Injectable()` class)
- File naming: `[action]-[resource].use-case.ts`
- Class naming: `[Action][Resource]UseCase`
- A single public method: `execute(...)`
- Inject repository via `@Inject(ITaskRepository)` using Symbol token

---

## 4. DTO (Input Validation)

```typescript
// src/adapters/controllers/tasks/dto/create-task.dto.ts
import { ApiProperty } from '@nestjs/swagger'

import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

import { TaskPriorityEnum } from '@domain/entities/task.entity'

export class CreateTaskDto {
  @ApiProperty({ required: true, maxLength: 255, description: 'Task title' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title!: string

  @ApiProperty({ required: false, maxLength: 20000 })
  @IsOptional()
  @IsString()
  @MaxLength(20000)
  description?: string

  @ApiProperty({ required: false, enum: TaskPriorityEnum })
  @IsOptional()
  @IsEnum(TaskPriorityEnum)
  priority?: TaskPriorityEnum

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  @IsDateString()
  dueDate?: Date
}
```

---

## 5. Presenter (Output Transformation)

```typescript
// src/adapters/controllers/tasks/presenters/get-detail-task.presenter.ts
import { ApiProperty } from '@nestjs/swagger'

import {
  TaskEntity,
  TaskPriorityEnum,
  TaskStatusEnum,
} from '@domain/entities/task.entity'

export class GetDetailTaskPresenter {
  @ApiProperty()
  id: number

  @ApiProperty()
  title: string

  @ApiProperty({
    enum: TaskStatusEnum,
    description: '2: Completed, 3: OnGoing',
  })
  status: TaskStatusEnum

  @ApiProperty({ enum: TaskPriorityEnum })
  priority: TaskPriorityEnum

  @ApiProperty({ required: false })
  description?: string

  @ApiProperty({ required: false })
  dueDate?: Date

  constructor(task: TaskEntity) {
    this.id = task.id
    this.title = task.title
    this.status = task.status
    this.priority = task.priority
    this.description = task.description
    this.dueDate = task.dueDate
  }
}
```

---

## 6. Controller

```typescript
// src/adapters/controllers/tasks/tasks.controller.ts
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { CreateTaskUseCase } from '@use-cases/tasks/create-task.use-case'
import { GetListTasksUseCase } from '@use-cases/tasks/get-list-tasks.use-case'

import { CheckPolicies } from '../common/decorators/check-policies.decorator'
import { User } from '../common/decorators/user.decorator'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { PoliciesGuard } from '../common/guards/policies.guard'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetListTasksDto } from './dto/get-list-tasks.dto'
import { CreateTaskPresenter } from './presenters/create-tasks.presenter'
import { GetListTasksPresenter } from './presenters/get-list-tasks.presenter'

@Controller('tasks')
@ApiTags('Tasks')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class TasksController {
  constructor(
    private readonly getListTasksUseCase: GetListTasksUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
  ) {}

  @Get()
  @ApiBearerAuth()
  @CheckPolicies({ action: 'read', subject: 'Task' })
  async findAll(
    @Query() queryParams: GetListTasksDto,
    @User('id') userId: number,
  ) {
    const tasks = await this.getListTasksUseCase.execute({
      ...queryParams,
      userId,
    })
    return GetListTasksPresenter.fromList(tasks)
  }

  @Post()
  @ApiBearerAuth()
  @CheckPolicies({ action: 'create', subject: 'Task' })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @User('id') userId: number,
  ) {
    const task = await this.createTaskUseCase.execute(
      {
        title: createTaskDto.title,
        description: createTaskDto.description,
        dueDate: createTaskDto.dueDate,
        priority: createTaskDto.priority,
      },
      userId,
    )
    return new CreateTaskPresenter(task)
  }
}
```

**Controller rules:**

- Controller responsibilities: receive request → call use case → return presenter
- No business logic in controllers
- Use `@User('id')` decorator to extract `userId` from JWT
- Use `@CheckPolicies({ action, subject })` for authorization

---

## 7. TypeORM Entity (Infrastructure)

```typescript
// src/infrastructure/databases/postgresql/entities/task.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { TaskPriorityEnum, TaskStatusEnum } from '@domain/entities/task.entity'

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @Column()
  title: string

  @Column({ default: TaskStatusEnum.OnGoing })
  status: TaskStatusEnum

  @Column({ default: TaskPriorityEnum.Medium })
  priority: TaskPriorityEnum

  @Column({ nullable: true })
  description?: string

  @Column({ nullable: true })
  dueDate?: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
```

---

## 8. Repository Implementation (Infrastructure)

```typescript
// src/infrastructure/databases/postgresql/repositories/task.repository.ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { In, Repository } from 'typeorm'

import { TaskEntity } from '@domain/entities/task.entity'
import { ITaskRepository } from '@domain/repositories/task.repository.interface'

import { Task } from '../entities/task.entity'

@Injectable()
export class TaskRepository implements ITaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findTasks({ size, status, priority, userId }) {
    const tasks = await this.taskRepository.find({
      where: this.buildWhereCondition({ userId, status, priority }),
      take: size,
      order: { id: 'DESC' },
    })
    return tasks.map((task) => this.toEntity(task))
  }

  async createTask(task: Partial<TaskEntity>): Promise<TaskEntity> {
    const newTask = this.taskRepository.create(task)
    const saved = await this.taskRepository.save(newTask)
    return this.toEntity(saved)
  }

  // Always use private toEntity() to map TypeORM entity → domain entity
  private toEntity(task: Task): TaskEntity {
    return new TaskEntity(
      task.id,
      task.userId,
      task.title,
      task.status,
      task.priority,
      task.createdAt,
      task.updatedAt,
      task.description,
      task.dueDate,
    )
  }
}
```

**Repository rules:**

- `implements ITaskRepository` — enforces the contract
- Always include `private toEntity()` to map to domain entity
- Never expose TypeORM entities outside the repository

---

## 9. Module (DI Wiring)

```typescript
// src/modules/task.module.ts
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ITaskRepository } from '@domain/repositories/task.repository.interface'

import { CountTasksUseCase } from '@use-cases/tasks/count-tasks.use-case'
import { CreateTaskUseCase } from '@use-cases/tasks/create-task.use-case'
import { GetListTasksUseCase } from '@use-cases/tasks/get-list-tasks.use-case'
import { UpdateTaskUseCase } from '@use-cases/tasks/update-task.use-case'

import { TaskRepository } from '@infrastructure/databases/postgresql/repositories/task.repository'
import { ExceptionsModule } from '@infrastructure/exceptions/exceptions.module'
import { CaslModule } from '@infrastructure/services/casl/casl.module'

import { TasksController } from '../adapters/controllers/tasks/tasks.controller'
import { Task } from '../infrastructure/databases/postgresql/entities/task.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Task]), CaslModule, ExceptionsModule],
  controllers: [TasksController],
  providers: [
    {
      provide: ITaskRepository, // Symbol token
      useClass: TaskRepository, // Concrete implementation
    },
    CountTasksUseCase,
    GetListTasksUseCase,
    CreateTaskUseCase,
    UpdateTaskUseCase,
  ],
})
export class TasksModule {}
```

---

## 10. Unit Test for Use Case

```typescript
// test/use-cases/tasks/create-task.use-case.spec.ts
import { Test, TestingModule } from '@nestjs/testing'

import { createTaskStub } from 'test/stubs/task.stub'

import { TaskPriorityEnum } from '@domain/entities/task.entity'
import { ITaskRepository } from '@domain/repositories/task.repository.interface'

import { CreateTaskUseCase } from '@use-cases/tasks/create-task.use-case'

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase
  let taskRepository: ITaskRepository

  // Arrange – set up mock module
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTaskUseCase,
        {
          provide: ITaskRepository,
          useValue: { createTask: jest.fn() },
        },
      ],
    }).compile()

    useCase = module.get<CreateTaskUseCase>(CreateTaskUseCase)
    taskRepository = module.get<ITaskRepository>(ITaskRepository)
  })

  it('should create a task with default priority', async () => {
    // Arrange
    const inputPayload = { title: 'Task 1' }
    const expectedTask = createTaskStub()

    jest.spyOn(taskRepository, 'createTask').mockResolvedValueOnce(expectedTask)

    // Act
    const actualResult = await useCase.execute(inputPayload, 1)

    // Assert
    expect(taskRepository.createTask).toHaveBeenCalledWith({
      ...inputPayload,
      userId: 1,
      priority: TaskPriorityEnum.Medium,
    })
    expect(actualResult).toEqual(expectedTask)
  })
})
```

**Testing rules:**

- Pattern: **Arrange → Act → Assert**
- Tests mirror the `src/` structure under `test/`
- Variable naming: `inputX`, `mockX`, `actualX`, `expectedX`
- Mock repositories with `jest.fn()` in `providers`
- Use stubs from `test/stubs/` for reusable test data
- Place reusable mock provider objects in `test/mocks/`
