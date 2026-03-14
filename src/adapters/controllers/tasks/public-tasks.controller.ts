import { Controller, Get, Query } from '@nestjs/common'
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { CountTasksUseCase } from '@use-cases/tasks/count-tasks.use-case'
import { GetListTasksUseCase } from '@use-cases/tasks/get-list-tasks.use-case'

import { ApiResponseType } from '../common/decorators/swagger-response.decorator'
import { CountTasksDto } from './dto/count-tasks.dto'
import { GetListTasksDto } from './dto/get-list-tasks.dto'
import { CountTasksPresenter } from './presenters/count-tasks.presenter'
import { GetListTasksPresenter } from './presenters/get-list-tasks.presenter'

@Controller('public/tasks')
@ApiTags('Public Tasks')
@ApiResponse({ status: 500, description: 'Internal error' })
export class PublicTasksController {
  constructor(
    private readonly getListTasksUseCase: GetListTasksUseCase,
    private readonly countTasksUseCase: CountTasksUseCase,
  ) {}

  @Get()
  @ApiExtraModels(GetListTasksPresenter)
  @ApiOperation({ summary: 'List', description: 'List all tasks (public)' })
  @ApiResponseType(GetListTasksPresenter, true)
  async findAll(@Query() querySearchParams: GetListTasksDto) {
    const tasks = await this.getListTasksUseCase.execute(querySearchParams)
    return GetListTasksPresenter.fromList(tasks)
  }

  @Get('count')
  @ApiExtraModels(CountTasksPresenter)
  @ApiOperation({ summary: 'Count', description: 'Count all tasks (public)' })
  @ApiResponseType(CountTasksPresenter, false)
  async count(@Query() countTaskDto: CountTasksDto) {
    const count = await this.countTasksUseCase.execute(countTaskDto)
    return new CountTasksPresenter(count)
  }
}
