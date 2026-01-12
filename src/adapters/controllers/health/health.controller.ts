import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { CheckHealthUseCase } from '@use-cases/health/check-health.use-case'

@Controller('health')
@ApiTags('Health')
export class HealthController {
  constructor(private readonly checkHealthUseCase: CheckHealthUseCase) {}

  @Get()
  async check() {
    return this.checkHealthUseCase.execute()
  }
}
