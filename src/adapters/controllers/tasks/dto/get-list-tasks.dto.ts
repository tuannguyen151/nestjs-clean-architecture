import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator'

import { TaskStatusEnum } from 'src/domain/entities/task.entity'
import { ISearchTasksParams } from 'src/domain/repositories/task.repository.interface'

export class GetListTasksDto implements ISearchTasksParams {
  @ApiProperty({
    required: false,
    enum: TaskStatusEnum,
    description: '2: Completed, 3: OnGoing, empty: All',
  })
  @Transform(({ value }) => parseInt(value))
  @IsEnum(TaskStatusEnum)
  @IsOptional()
  status?: TaskStatusEnum

  @ApiProperty({
    required: false,
    minimum: 1,
    description: 'empty: All',
  })
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @Min(1)
  size?: number
}
