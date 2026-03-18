import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { IDatabaseConfig } from '@domain/config/database.interface'
import { IJwtConfig } from '@domain/config/jwt.interface'
import { IMaintenanceConfig } from '@domain/config/maintenance.interface'

import { EnvironmentConfigService } from './environment-config.service'
import { validate } from './environment-config.validation'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      ignoreEnvFile:
        process.env['NODE_ENV'] !== 'local' &&
        process.env['NODE_ENV'] !== 'test',
      isGlobal: true,
      validate,
    }),
  ],
  providers: [
    EnvironmentConfigService,
    {
      provide: IJwtConfig,
      useExisting: EnvironmentConfigService,
    },
    {
      provide: IDatabaseConfig,
      useExisting: EnvironmentConfigService,
    },
    {
      provide: IMaintenanceConfig,
      useExisting: EnvironmentConfigService,
    },
  ],
  exports: [
    EnvironmentConfigService,
    IJwtConfig,
    IDatabaseConfig,
    IMaintenanceConfig,
  ],
})
export class EnvironmentConfigModule {}
