import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { LoggerModule } from './infrastructure/logger/logger.module'
import { ExceptionsModule } from './infrastructure/exceptions/exceptions.module'
import { EnvironmentConfigModule } from './infrastructure/config/environment/environment-config.module'
import { TypeOrmConfigModule } from './infrastructure/databases/postgressql/typeorm.module'

import { AuthModule } from './modules/auth.module'
import { JwtStrategy } from './infrastructure/common/strategies/jwt.strategy'
import { TasksModule } from './modules/task.module'

@Module({
  imports: [
    EnvironmentConfigModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    LoggerModule,
    ExceptionsModule,
    TypeOrmConfigModule,

    AuthModule,
    TasksModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
