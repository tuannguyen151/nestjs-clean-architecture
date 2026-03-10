import { Inject, Injectable } from '@nestjs/common'

import { IAuthTokensResult, IJwtService } from '@domain/services/jwt.interface'

@Injectable()
export class RefreshUseCase {
  constructor(
    @Inject(IJwtService)
    private readonly jwtService: IJwtService,
  ) {}

  async execute(payload: { userId: number }): Promise<IAuthTokensResult> {
    const [access, refresh] = await Promise.all([
      this.jwtService.createToken({ id: payload.userId }, 'access'),
      this.jwtService.createToken({ id: payload.userId }, 'refresh'),
    ])

    return {
      accessToken: access.token,
      accessExpiresAt: access.expiresAt,
      refreshToken: refresh.token,
      refreshExpiresAt: refresh.expiresAt,
    }
  }
}
