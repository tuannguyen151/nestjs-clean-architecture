import { ApiProperty } from '@nestjs/swagger'

import { Transform } from 'class-transformer'
import { IsEnum, IsOptional } from 'class-validator'

import { TaskPriorityEnum, TaskStatusEnum } from '@domain/entities/task.entity'
import { ICountTasksParams } from '@domain/repositories/task.repository.interface'

import {
  IsValidPriorityList,
  parsePriorityList,
} from './validators/priority-list.validator'

export class CountTasksDto implements ICountTasksParams {
  @ApiProperty({
    required: false,
    enum: TaskStatusEnum,
    description: '2: Completed, 3: OnGoing, empty: All',
  })
  @Transform(({ value }: { value?: string }) =>
    value ? Number.parseInt(value, 10) : undefined,
  )
  @IsEnum(TaskStatusEnum)
  @IsOptional()
  status?: TaskStatusEnum

  @ApiProperty({
    required: false,
    enum: TaskPriorityEnum,
    description:
      'Priority filter: single value or comma-separated values (Low, Medium, High, Urgent)',
    example: 'Medium,High',
  })
  @IsOptional()
  @Transform(({ value }: { value?: string }) => parsePriorityList(value))
  @IsValidPriorityList()
  priority?: TaskPriorityEnum | TaskPriorityEnum[]
}
