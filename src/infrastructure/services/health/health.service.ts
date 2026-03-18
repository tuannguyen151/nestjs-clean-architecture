import { Injectable } from '@nestjs/common'
import { HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus'

import {
  IHealthCheckResult,
  IHealthService,
} from '@domain/services/health.interface'

const MEMORY_HEAP_THRESHOLD_BYTES = 150 * 1024 * 1024

@Injectable()
export class HealthService implements IHealthService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  async checkMemoryHeap(): Promise<IHealthCheckResult> {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', MEMORY_HEAP_THRESHOLD_BYTES),
    ])
  }
}
