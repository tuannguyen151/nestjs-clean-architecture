export const IJwtConfig = Symbol('IJwtConfig')
export interface IJwtConfig {
  getJwtSecret(): string
  getJwtExpirationTime(): string
  getJwtRefreshSecret(): string
  getJwtRefreshExpirationTime(): string
}
