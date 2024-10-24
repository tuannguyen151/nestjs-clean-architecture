import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IDatabaseConfig } from '../../../domain/config/database.interface'
import { IAwsConfig } from 'src/domain/config/aws.interface'

@Injectable()
export class EnvironmentConfigService implements IDatabaseConfig, IAwsConfig {
  constructor(private configService: ConfigService) {}

  getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV')
  }

  getDatabaseEngine(): string {
    return this.configService.get<string>('DATABASE_ENGINE')
  }

  getDatabaseHost(): string {
    return this.configService.get<string>('DATABASE_HOST')
  }

  getDatabasePort(): number {
    return this.configService.get<number>('DATABASE_PORT')
  }

  getDatabaseUser(): string {
    return this.configService.get<string>('DATABASE_USER')
  }

  getDatabasePassword(): string {
    return this.configService.get<string>('DATABASE_PASSWORD')
  }

  getDatabaseName(): string {
    return this.configService.get<string>('DATABASE_NAME')
  }

  getDatabaseSchema(): string {
    return this.configService.get<string>('DATABASE_SCHEMA')
  }

  getDatabaseSync(): boolean {
    return this.configService.get<boolean>('DATABASE_SYNCHRONIZE')
  }

  getAwsCognitoUserPoolId(): string {
    return this.configService.get<string>('AWS_COGNITO_USER_POOL_ID')
  }

  getAwsCognitoClientId(): string {
    return this.configService.get<string>('AWS_COGNITO_CLIENT_ID')
  }

  getAwsCognitoAuthorityUrl(): string {
    return this.configService.get<string>('AWS_COGNITO_AUTHORITY_URL')
  }

  getAwsRegion(): string {
    return this.configService.get<string>('AWS_REGION')
  }
}
