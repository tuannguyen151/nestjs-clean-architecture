import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateTaskDto } from './create-task.dto'
import { TaskStatusEnum } from 'src/domain/entities/task.entity'
import { IsEnum, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    required: false,
    enum: TaskStatusEnum,
    description: '2: Completed, 3: OnGoing',
  })
  @Transform(({ value }) => parseInt(value))
  @IsEnum(TaskStatusEnum)
  @IsOptional()
  status?: TaskStatusEnum
}
