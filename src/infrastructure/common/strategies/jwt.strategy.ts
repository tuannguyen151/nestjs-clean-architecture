import { Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import type { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { IJwtConfig } from '@domain/config/jwt.interface'
import { IException } from '@domain/exceptions/exceptions.interface'
import { ILogger } from '@domain/logger/logger.interface'
import { IUserRepository } from '@domain/repositories/user.repository.interface'
import type { IJwtServicePayload } from '@domain/services/jwt.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ILogger)
    private readonly logger: ILogger,
    @Inject(IException)
    private readonly exceptionService: IException,
    @Inject(IJwtConfig)
    private readonly jwtConfig: IJwtConfig,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          const token: unknown = request?.cookies?.['access_token']
          return typeof token === 'string' ? token : null
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.getJwtSecret(),
    })
  }

  async validate(payload: IJwtServicePayload) {
    const user = await this.userRepository.getUserById(payload.id)

    if (!user) {
      this.logger.warn('JwtStrategy', 'User not found')
      this.exceptionService.unauthorizedException({
        type: 'Unauthorized',
        message: 'User not found',
      })
    }

    return user
  }
}
