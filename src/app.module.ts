import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { JwtStrategy } from './infrastructure/common/strategies/jwt.strategy'
import { EnvironmentConfigModule } from './infrastructure/config/environment/environment-config.module'
import { TypeOrmConfigModule } from './infrastructure/databases/postgressql/typeorm.module'
import { ExceptionsModule } from './infrastructure/exceptions/exceptions.module'
import { LoggerModule } from './infrastructure/logger/logger.module'
import { AuthModule } from './modules/auth.module'
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
