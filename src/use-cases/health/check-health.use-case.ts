import { Inject, Injectable } from '@nestjs/common'

import {
  IHealthCheckResult,
  IHealthService,
} from '@domain/services/health.interface'

@Injectable()
export class CheckHealthUseCase {
  constructor(
    @Inject(IHealthService)
    private readonly healthService: IHealthService,
  ) {}

  async execute(): Promise<IHealthCheckResult> {
    return this.healthService.checkMemoryHeap()
  }
}
