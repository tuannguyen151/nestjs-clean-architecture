import { ApiProperty } from '@nestjs/swagger'

export class LoginPresenter {
  @ApiProperty({ required: true })
  accessToken: string

  @ApiProperty({ required: true })
  refreshToken: string

  constructor({ accessToken, refreshToken }: LoginPresenter) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
  }
}
