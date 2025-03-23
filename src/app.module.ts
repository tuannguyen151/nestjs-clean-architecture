import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import { MaintenanceMiddleware } from './infrastructure/common/middlewares/maintenance.middleware'
import { JwtRefreshStrategy } from './infrastructure/common/strategies/jwt-refresh.strategy'
import { JwtStrategy } from './infrastructure/common/strategies/jwt.strategy'
import { EnvironmentConfigModule } from './infrastructure/config/environment/environment-config.module'
import { User } from './infrastructure/databases/postgressql/entities/user.entity'
import { UserRepository } from './infrastructure/databases/postgressql/repositories/user.repository'
import { TypeOrmConfigModule } from './infrastructure/databases/postgressql/typeorm.module'
import { ExceptionsModule } from './infrastructure/exceptions/exceptions.module'
import { LoggerModule } from './infrastructure/logger/logger.module'
import { AuthModule } from './modules/auth.module'
import { HealthModule } from './modules/health.module'
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
    TypeOrmModule.forFeature([User]),

    HealthModule,
    AuthModule,
    TasksModule,
  ],
  providers: [UserRepository, JwtStrategy, JwtRefreshStrategy],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MaintenanceMiddleware)
      .exclude({
        version: ['1'],
        path: 'health',
        method: RequestMethod.GET,
      })
      .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
