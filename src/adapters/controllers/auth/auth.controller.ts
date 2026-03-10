import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import type { CookieOptions, Response } from 'express'

import { LoginUseCase } from '@use-cases/auth/login.use-case'
import { RefreshUseCase } from '@use-cases/auth/refresh.use-case'

import { ApiResponseType } from '../common/decorators/swagger-response.decorator'
import { User } from '../common/decorators/user.decorator'
import JwtRefreshGuard from '../common/guards/jwt-refresh.guard'
import { LoginDto } from './dto/login.dto'
import { LoginPresenter } from './presenters/login.presenter'
import { RefreshPresenter } from './presenters/refresh.presenter'

const BASE_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
}

@Controller('auth')
@ApiTags('auth')
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshUseCase: RefreshUseCase,
  ) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: 'Login', description: 'Login a user' })
  @ApiExtraModels(LoginPresenter)
  @ApiResponseType(LoginPresenter, false)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.loginUseCase.execute(loginDto)

    res.cookie('access_token', tokens.accessToken, {
      ...BASE_COOKIE_OPTIONS,
      expires: tokens.accessExpiresAt,
    })
    res.cookie('refresh_token', tokens.refreshToken, {
      ...BASE_COOKIE_OPTIONS,
      expires: tokens.refreshExpiresAt,
      path: '/api/v1/auth/refresh',
    })

    return new LoginPresenter(tokens)
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  @ApiCookieAuth('refresh_token')
  @ApiOperation({
    summary: 'Get new tokens',
    description: 'Get new access and refresh tokens using refresh token',
  })
  @ApiExtraModels(RefreshPresenter)
  @ApiResponseType(RefreshPresenter, false)
  async refresh(
    @User('id') userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.refreshUseCase.execute({ userId })

    res.cookie('access_token', tokens.accessToken, {
      ...BASE_COOKIE_OPTIONS,
      expires: tokens.accessExpiresAt,
    })
    res.cookie('refresh_token', tokens.refreshToken, {
      ...BASE_COOKIE_OPTIONS,
      expires: tokens.refreshExpiresAt,
      path: '/api/v1/auth/refresh',
    })

    return new RefreshPresenter(tokens)
  }
}
