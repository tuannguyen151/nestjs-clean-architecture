import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

import { Transform } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator'

import { TaskStatusEnum } from '@domain/entities/task.entity'
import { TaskPriorityEnum } from '@domain/enums/task-priority.enum'
import { ISearchTasksParams } from '@domain/repositories/task.repository.interface'

export class GetListTasksDto implements ISearchTasksParams {
  @ApiProperty({
    required: false,
    enum: TaskStatusEnum,
    description: '2: Completed, 3: OnGoing, empty: All',
  })
  @Transform(({ value }: { value: string }) => parseInt(value))
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
  @Transform(({ value }: { value: string }) => {
    if (!value) return undefined
    const values = value
      .toString()
      .split(',')
      .map((v) => parseInt(v.trim()))

    // Validate each value is a valid priority
    const validPriorities = Object.values(TaskPriorityEnum)
    for (const val of values) {
      if (!validPriorities.includes(val)) {
        throw new BadRequestException({
          type: 'InvalidPriorityException',
          message: `Invalid priority value: ${val}. Valid values are: ${validPriorities.join(', ')}`,
        })
      }
    }

    return values.length === 1 ? values[0] : values
  })
  priority?: TaskPriorityEnum | TaskPriorityEnum[]

  @ApiProperty({
    required: false,
    minimum: 1,
    description: 'empty: All',
  })
  @IsNumber()
  @Transform(({ value }: { value: string }) => parseInt(value))
  @IsOptional()
  @Min(1)
  size?: number
}
