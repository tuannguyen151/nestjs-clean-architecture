export interface IHealthCheckResult {
  status: string
  info?: Record<string, unknown>
  error?: Record<string, unknown>
  details?: Record<string, unknown>
}

export const IHealthService = Symbol('IHealthService')
export interface IHealthService {
  checkMemoryHeap(): Promise<IHealthCheckResult>
}
