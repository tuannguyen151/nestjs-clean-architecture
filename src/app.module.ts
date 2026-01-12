import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { MaintenanceMiddleware } from './infrastructure/common/middlewares/maintenance.middleware'
import { EnvironmentConfigModule } from './infrastructure/config/environment/environment-config.module'
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

    HealthModule,
    AuthModule,
    TasksModule,
  ],
  providers: [],
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
