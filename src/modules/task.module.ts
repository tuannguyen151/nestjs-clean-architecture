import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ITaskRepository } from '@domain/repositories/task.repository.interface'

import { CountTasksUseCase } from '@use-cases/tasks/count-tasks.use-case'
import { CreateTaskUseCase } from '@use-cases/tasks/create-task.use-case'
import { GetDetailTaskUseCase } from '@use-cases/tasks/get-detail-task.use-case'
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
      provide: ITaskRepository,
      useClass: TaskRepository,
    },

    CountTasksUseCase,
    GetListTasksUseCase,
    CreateTaskUseCase,
    GetDetailTaskUseCase,
    UpdateTaskUseCase,
  ],
})
export class TasksModule {}
