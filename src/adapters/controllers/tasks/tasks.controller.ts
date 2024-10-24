import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import {
  ApiCreatedResponseType,
  ApiResponseType,
} from '../swagger-response.decorator'

import { GetListTasksPresenter } from './presenters/get-list-tasks.presenter'
import { GetListTasksDto } from './dto/get-list-tasks.dto'

import { JwtAuthGuard } from '../jwt-auth.guard'
import { GetListTasksUseCase } from 'src/use-cases/tasks/get-list-tasks.use-case'

import { CreateTaskDto } from './dto/create-task.dto'
import { CreateTaskUseCase } from 'src/use-cases/tasks/create-task.use-case'
import { CreateTaskPresenter } from './presenters/create-tasks.presenter'

import { GetDetailTaskUseCase } from 'src/use-cases/tasks/get-detail-task.use-case'
import { GetDetailTaskPresenter } from './presenters/get-detail-task.presenter'

import { UpdateTaskUseCase } from 'src/use-cases/tasks/update-task.use-case'
import { UpdateTaskDto } from './dto/update-task.dto'

import { CountTasksUseCase } from 'src/use-cases/tasks/count-tasks.use-case'
import { CountTasksPresenter } from './presenters/count-tasks.presenter'
import { CountTasksDto } from './dto/count-tasks.dto'
import { User } from '../user.decorator'

@Controller('tasks')
@ApiTags('Tasks')
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(GetListTasksPresenter)
export class TasksController {
  constructor(
    private readonly getListTasksUseCase: GetListTasksUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getDetailTaskUseCase: GetDetailTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly countTasksUseCase: CountTasksUseCase,
  ) {}

  @Get('count')
  @UseGuards(JwtAuthGuard)
  @ApiExtraModels(CountTasksPresenter)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Count', description: 'Count tasks' })
  @ApiResponseType(CountTasksPresenter, false)
  async count(
    @Query() countTaskDto: CountTasksDto,
    @User('userId') userId: string,
  ) {
    const count = await this.countTasksUseCase.execute({
      userId: userId,
      ...countTaskDto,
    })

    return new CountTasksPresenter({ count })
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List', description: 'List tasks' })
  @ApiResponseType(GetListTasksPresenter, true)
  async findAll(
    @Query() querySearchParams: GetListTasksDto,
    @User('userId') userId: string,
  ) {
    const tasks = await this.getListTasksUseCase.execute({
      ...querySearchParams,
      userId: userId,
    })

    return tasks.map((task) => new GetListTasksPresenter(task))
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiExtraModels(CreateTaskPresenter)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create', description: 'Create a task' })
  @ApiCreatedResponseType(CreateTaskPresenter, false)
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @User('userId') userId: string,
  ) {
    const task = await this.createTaskUseCase.execute({
      ...createTaskDto,
      userId: userId,
    })

    return new CreateTaskPresenter(task)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiExtraModels(GetDetailTaskPresenter)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Detail', description: 'Detail task' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiResponseType(GetDetailTaskPresenter, false)
  async findOne(
    @User('userId') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const task = await this.getDetailTaskUseCase.execute({
      id: id,
      userId: userId,
    })

    return new GetDetailTaskPresenter(task)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update', description: 'Update a task' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiOkResponse({ description: 'Task updated' })
  async update(
    @User('userId') userId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const isUpdated = await this.updateTaskUseCase.execute(
      {
        id: id,
        userId: userId,
      },
      updateTaskDto,
    )

    return isUpdated
  }
}
