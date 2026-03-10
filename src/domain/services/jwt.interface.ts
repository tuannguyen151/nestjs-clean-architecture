export interface IJwtServicePayload {
  id: number
}

export interface IJwtTokenResult {
  token: string
  expiresAt: Date
}

export interface IAuthTokensResult {
  accessToken: string
  accessExpiresAt: Date
  refreshToken: string
  refreshExpiresAt: Date
}

export const IJwtService = Symbol('IJwtService')
export interface IJwtService {
  checkToken(token: string): Promise<IJwtServicePayload>
  createToken(
    payload: IJwtServicePayload,
    type: 'access' | 'refresh',
  ): Promise<IJwtTokenResult>
}
