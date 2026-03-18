import { Inject, Injectable } from '@nestjs/common'
import { JwtService as JwtServiceBase, JwtSignOptions } from '@nestjs/jwt'

import ms from 'ms'
import type { StringValue } from 'ms'

import { IJwtConfig } from '@domain/config/jwt.interface'
import { IJwtService, IJwtTokenResult } from '@domain/services/jwt.interface'
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

  async createToken(
    payload: IJwtServicePayload,
    type: 'access' | 'refresh',
  ): Promise<IJwtTokenResult> {
    let jwtSignOptions: JwtSignOptions
    let expirationTime: string

    if (type === 'refresh') {
      expirationTime = this.jwtConfig.getJwtRefreshExpirationTime()
      jwtSignOptions = {
        secret: this.jwtConfig.getJwtRefreshSecret(),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        expiresIn: expirationTime as StringValue,
      }
    } else {
      expirationTime = this.jwtConfig.getJwtExpirationTime()
      jwtSignOptions = {
        secret: this.jwtConfig.getJwtSecret(),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        expiresIn: expirationTime as StringValue,
      }
    }

    const token = await this.jwtServiceBase.signAsync(payload, jwtSignOptions)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const expiresAt = new Date(Date.now() + ms(expirationTime as StringValue))

    return { token, expiresAt }
  }
}
