import { Inject, Injectable } from '@nestjs/common'

import { IJwtService } from '@domain/services/jwt.interface'

@Injectable()
export class RefreshUseCase {
  constructor(
    @Inject(IJwtService)
    private readonly jwtService: IJwtService,
  ) {}

  async execute(payload: { userId: number }) {
    const tokens = await this.createTokens(payload.userId)

    return tokens
  }

  private async createTokens(userId: number) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.createToken(
        {
          id: userId,
        },
        'access',
      ),
      this.jwtService.createToken(
        {
          id: userId,
        },
        'refresh',
      ),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }
}
