import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TasksController } from '../adapters/controllers/tasks/tasks.controller'
import { Task } from '../infrastructure/databases/postgressql/entities/task.entity'
import { TASK_REPOSITORY } from 'src/domain/repositories/task.repository.interface'
import { TaskRepository } from 'src/infrastructure/databases/postgressql/repositories/task.repository'
import { EXCEPTIONS } from 'src/domain/exceptions/exceptions.interface'
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service'

import { GetListTasksUseCase } from 'src/use-cases/tasks/get-list-tasks.use-case'
import { CreateTaskUseCase } from 'src/use-cases/tasks/create-task.use-case'
import { GetDetailTaskUseCase } from 'src/use-cases/tasks/get-detail-task.use-case'
import { UpdateTaskUseCase } from 'src/use-cases/tasks/update-task.use-case'
import { CountTasksUseCase } from 'src/use-cases/tasks/count-tasks.use-case'

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [
    {
      provide: TASK_REPOSITORY,
      useClass: TaskRepository,
    },
    {
      provide: EXCEPTIONS,
      useClass: ExceptionsService,
    },

    CountTasksUseCase,
    GetListTasksUseCase,
    CreateTaskUseCase,
    GetDetailTaskUseCase,
    UpdateTaskUseCase,
  ],
})
export class TasksModule {}
