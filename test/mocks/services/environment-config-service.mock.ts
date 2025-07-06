import { IJwtConfig } from '@domain/config/jwt.interface'

export const environmentConfigServiceMock: Partial<IJwtConfig> = {
  getJwtSecret: () => 'test-secret',
  getJwtExpirationTime: () => '1h',
  getJwtRefreshSecret: () => 'test-refresh-secret',
  getJwtRefreshExpirationTime: () => '7d',
}
