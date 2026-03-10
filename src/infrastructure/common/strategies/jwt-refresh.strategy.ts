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
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(IJwtConfig)
    private readonly jwtConfig: IJwtConfig,
    @Inject(ILogger)
    private readonly logger: ILogger,
    @Inject(IException)
    private readonly exceptionService: IException,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) =>
          (request?.cookies?.['refresh_token'] as string) ?? null,
      ]),
      secretOrKey: jwtConfig.getJwtRefreshSecret(),
      passReqToCallback: true,
    })
  }

  async validate(payload: IJwtServicePayload) {
    const user = await this.userRepository.getUserById(payload.id)
    if (!user) {
      this.logger.warn('JwtRefreshStrategy', 'User not found')
      this.exceptionService.unauthorizedException({
        type: 'Unauthorized',
        message: 'User not found',
      })
    }

    return user
  }
}
