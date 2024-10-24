import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsEmail } from 'class-validator'

export class LoginDto {
  @ApiProperty({ required: true, format: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    required: true,
    format: 'password',
  })
  @IsNotEmpty()
  @IsString()
  password: string
}
