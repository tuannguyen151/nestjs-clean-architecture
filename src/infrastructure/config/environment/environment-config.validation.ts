import { plainToClass } from 'class-transformer'
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  IsUrl,
  validateSync,
} from 'class-validator'

enum EnvironmentEnum {
  Development = 'local',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(EnvironmentEnum)
  NODE_ENV: EnvironmentEnum

  @IsString()
  DATABASE_ENGINE: string
  @IsString()
  DATABASE_HOST: string
  @IsNumber()
  DATABASE_PORT: number
  @IsString()
  DATABASE_USER: string
  @IsString()
  DATABASE_PASSWORD: string
  @IsString()
  DATABASE_NAME: string
  @IsString()
  DATABASE_SCHEMA: string
  @IsBoolean()
  DATABASE_SYNCHRONIZE: boolean

  @IsString()
  AWS_COGNITO_USER_POOL_ID: string
  @IsString()
  AWS_COGNITO_CLIENT_ID: string
  @IsUrl()
  AWS_COGNITO_AUTHORITY_URL: string
  @IsString()
  AWS_REGION: string
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }
  return validatedConfig
}
