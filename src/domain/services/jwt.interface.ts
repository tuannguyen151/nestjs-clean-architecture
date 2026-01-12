export interface IJwtServicePayload {
  id: number
}

export const IJwtService = Symbol('IJwtService')
export interface IJwtService {
  checkToken(token: string): Promise<IJwtServicePayload>
  createToken(
    payload: IJwtServicePayload,
    type: 'access' | 'refresh',
  ): Promise<string>
}
