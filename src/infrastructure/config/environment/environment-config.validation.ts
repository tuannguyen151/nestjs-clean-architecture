import { plainToClass } from 'class-transformer'
import {
  IsBoolean,
  IsBooleanString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
  validateSync,
} from 'class-validator'

enum EnvironmentEnum {
  Development = 'local',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(EnvironmentEnum)
  @IsNotEmpty()
  NODE_ENV!: EnvironmentEnum

  @IsString()
  @IsNotEmpty()
  DATABASE_ENGINE!: string

  @IsString()
  @IsNotEmpty()
  DATABASE_HOST!: string

  @IsNumber()
  @IsNotEmpty()
  DATABASE_PORT!: number

  @IsString()
  @IsNotEmpty()
  DATABASE_USER!: string

  @IsString()
  @IsNotEmpty()
  DATABASE_PASSWORD!: string

  @IsString()
  @IsNotEmpty()
  DATABASE_NAME!: string

  @IsString()
  @IsNotEmpty()
  DATABASE_SCHEMA!: string

  @IsBoolean()
  @IsNotEmpty()
  DATABASE_SYNCHRONIZE!: boolean

  @IsOptional()
  @IsBooleanString()
  MAINTENANCE_MODE?: string

  @ValidateIf((env: EnvironmentVariables) => env.MAINTENANCE_MODE === 'true')
  @IsString()
  MAINTENANCE_MESSAGE?: string

  @IsString()
  AWS_COGNITO_USER_POOL_ID?: string
  @IsString()
  AWS_COGNITO_CLIENT_ID?: string
  @IsUrl()
  AWS_COGNITO_AUTHORITY_URL?: string
  @IsString()
  AWS_REGION?: string
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
