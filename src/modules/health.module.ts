import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'

import { IHealthService } from '@domain/services/health.interface'

import { CheckHealthUseCase } from '@use-cases/health/check-health.use-case'

import { HealthController } from '@adapters/controllers/health/health.controller'

import { HealthService } from '@infrastructure/services/health/health.service'

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [
    {
      provide: IHealthService,
      useClass: HealthService,
    },

    CheckHealthUseCase,
  ],
})
export class HealthModule {}
