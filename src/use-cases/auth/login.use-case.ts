import { Inject, Injectable } from '@nestjs/common'

import { IException } from '@domain/exceptions/exceptions.interface'
import { IUserRepository } from '@domain/repositories/user.repository.interface'
import { IBcryptService } from '@domain/services/bcrypt.interface'
import { IAuthTokensResult, IJwtService } from '@domain/services/jwt.interface'

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IBcryptService)
    private readonly bcryptService: IBcryptService,
    @Inject(IJwtService)
    private readonly jwtService: IJwtService,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IException)
    private readonly exceptionsService: IException,
  ) {}

  async execute(payload: {
    username: string
    password: string
  }): Promise<IAuthTokensResult> {
    const user = await this.userRepository.getUserByUsername(payload.username)
    if (!user)
      this.exceptionsService.badRequestException({
        type: 'BadRequest',
        message: 'User not found',
      })

    const passwordMatches = await this.bcryptService.compare(
      payload.password,
      user.hashedPassword,
    )

    if (!passwordMatches)
      this.exceptionsService.badRequestException({
        type: 'BadRequest',
        message: 'Password is incorrect',
      })

    const [tokens] = await Promise.all([
      this.createTokens(user.id),
      this.updateLoginTime(user.id),
    ])

    return tokens
  }

  private async updateLoginTime(userId: number) {
    await this.userRepository.updateLastLogin(userId)
  }

  private async createTokens(userId: number): Promise<IAuthTokensResult> {
    const [access, refresh] = await Promise.all([
      this.jwtService.createToken({ id: userId }, 'access'),
      this.jwtService.createToken({ id: userId }, 'refresh'),
    ])

    return {
      accessToken: access.token,
      accessExpiresAt: access.expiresAt,
      refreshToken: refresh.token,
      refreshExpiresAt: refresh.expiresAt,
    }
  }
}
