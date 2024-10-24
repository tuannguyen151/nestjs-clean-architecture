import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEnum, IsOptional } from 'class-validator'
import { TaskStatusEnum } from 'src/domain/entities/task.entity'

export class CountTasksDto {
  @ApiProperty({
    required: false,
    enum: TaskStatusEnum,
    description: '2: Completed, 3: OnGoing, empty: All',
  })
  @Transform(({ value }) => parseInt(value))
  @IsEnum(TaskStatusEnum)
  @IsOptional()
  status?: TaskStatusEnum
}
