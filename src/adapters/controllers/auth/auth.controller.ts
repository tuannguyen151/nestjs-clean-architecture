import { Body, Controller, Post } from '@nestjs/common'
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { ApiResponseType } from '../swagger-response.decorator'

import { LoginDto } from './dto/login.dto'
import { LoginUseCase } from 'src/use-cases/auth/login.use-case'
import { LoginPresenter } from './presenters/login.presenter'

import { RefreshDto } from './dto/refresh.dto'
import { GetNewIdTokenUseCase } from 'src/use-cases/auth/get-new-id-token.use-case'
import { RefreshPresenter } from './presenters/refresh.presenter'

@Controller('auth')
@ApiTags('auth')
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(LoginPresenter)
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly getNewIdTokenUseCase: GetNewIdTokenUseCase,
  ) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: 'Login', description: 'Login a user' })
  @ApiResponseType(LoginPresenter, false)
  async login(@Body() loginDto: LoginDto) {
    const data = await this.loginUseCase.execute(loginDto)
    if (!data) return

    const { idToken, refreshToken } = data
    return new LoginPresenter({ accessToken: idToken, refreshToken })
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Get new access token',
    description: 'Get new access token using refresh token',
  })
  @ApiBody({ type: RefreshDto })
  @ApiExtraModels(RefreshPresenter)
  @ApiResponseType(RefreshPresenter, false)
  async refresh(@Body() body: RefreshDto) {
    const accessToken = await this.getNewIdTokenUseCase.execute(
      body.refreshToken,
    )

    return new RefreshPresenter({ accessToken })
  }
}
