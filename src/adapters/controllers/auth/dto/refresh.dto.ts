import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class RefreshDto {
  @ApiProperty({
    required: true,
    format: 'string',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string
}
