import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { IDatabaseConfig } from '@domain/config/database.interface'
import { IJwtConfig } from '@domain/config/jwt.interface'
import { IMaintenanceConfig } from '@domain/config/maintenance.interface'

@Injectable()
export class EnvironmentConfigService
  implements IDatabaseConfig, IJwtConfig, IMaintenanceConfig
{
  constructor(private readonly configService: ConfigService) {}

  getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV') || ''
  }

  getDatabaseEngine(): string {
    return this.configService.get<string>('DATABASE_ENGINE') || ''
  }

  getDatabaseHost(): string {
    return this.configService.get<string>('DATABASE_HOST') || ''
  }

  getDatabasePort(): number {
    return this.configService.get<number>('DATABASE_PORT') || 0
  }

  getDatabaseUser(): string {
    return this.configService.get<string>('DATABASE_USER') || ''
  }

  getDatabasePassword(): string {
    return this.configService.get<string>('DATABASE_PASSWORD') || ''
  }

  getDatabaseName(): string {
    return this.configService.get<string>('DATABASE_NAME') || ''
  }

  getDatabaseSchema(): string {
    return this.configService.get<string>('DATABASE_SCHEMA') || 'public'
  }

  getDatabaseSync(): boolean {
    return this.configService.get<boolean>('DATABASE_SYNCHRONIZE') || false
  }

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') || ''
  }

  getJwtExpirationTime(): string {
    return this.configService.get<string>('JWT_EXPIRATION_TIME') || ''
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET') || ''
  }

  getJwtRefreshExpirationTime(): string {
    return this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME') || ''
  }

  isMaintenanceMode(): boolean {
    return this.configService.get<string>('MAINTENANCE_MODE') === 'true'
  }

  getMaintenanceMessage(): string {
    return (
      this.configService.get<string>('MAINTENANCE_MESSAGE') ??
      'Service Unavailable'
    )
  }
}
