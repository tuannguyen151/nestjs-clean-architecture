export const ILogger = Symbol('ILogger')
export interface ILogger {
  debug(context: string, message: unknown): void
  log(context: string, message: unknown): void
  error(context: string, message: unknown, trace?: string): void
  warn(context: string, message: unknown): void
  verbose(context: string, message: unknown): void
}
