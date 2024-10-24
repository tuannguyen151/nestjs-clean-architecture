import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { EnvironmentConfigModule } from 'src/infrastructure/config/environment/environment-config.module'
import { EnvironmentConfigService } from 'src/infrastructure/config/environment/environment-config.service'

export const getTypeOrmModuleOptions = (
  config: EnvironmentConfigService,
): TypeOrmModuleOptions =>
  ({
    type: config.getDatabaseEngine(),
    host: config.getDatabaseHost(),
    port: config.getDatabasePort(),
    username: config.getDatabaseUser(),
    password: config.getDatabasePassword(),
    database: config.getDatabaseName(),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: config.getNodeEnv() !== 'production',
    schema: process.env.DATABASE_SCHEMA,
    migrationsRun: false,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    subscribers: ['src/migrations'],
    logging: config.getNodeEnv() !== 'production',
  }) as TypeOrmModuleOptions

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: getTypeOrmModuleOptions,
    }),
  ],
})
export class TypeOrmConfigModule {}
