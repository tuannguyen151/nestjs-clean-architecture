import { Inject, Injectable } from '@nestjs/common'
import { JwtService as JwtServiceBase, JwtSignOptions } from '@nestjs/jwt'

import type { StringValue } from 'ms'

import { IJwtConfig } from '@domain/config/jwt.interface'
import { IJwtService } from '@domain/services/jwt.interface'
import type { IJwtServicePayload } from '@domain/services/jwt.interface'

@Injectable()
export class JwtService implements IJwtService {
  constructor(
    private readonly jwtServiceBase: JwtServiceBase,
    @Inject(IJwtConfig)
    private readonly jwtConfig: IJwtConfig,
  ) {}

  async checkToken(token: string) {
    const decode =
      await this.jwtServiceBase.verifyAsync<IJwtServicePayload>(token)
    return decode
  }

  async createToken(payload: IJwtServicePayload, type: 'access' | 'refresh') {
    let jwtSignOptions: JwtSignOptions

    if (type === 'refresh') {
      jwtSignOptions = {
        secret: this.jwtConfig.getJwtRefreshSecret(),
        expiresIn: this.jwtConfig.getJwtRefreshExpirationTime() as StringValue,
      }
    } else {
      jwtSignOptions = {
        secret: this.jwtConfig.getJwtSecret(),
        expiresIn: this.jwtConfig.getJwtExpirationTime() as StringValue,
      }
    }

    return await this.jwtServiceBase.signAsync(payload, jwtSignOptions)
  }
}
