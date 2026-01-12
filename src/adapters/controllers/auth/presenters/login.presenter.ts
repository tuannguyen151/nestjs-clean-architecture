import { ApiProperty } from '@nestjs/swagger'

export class LoginPresenter {
  @ApiProperty({ required: true })
  accessToken: string

  @ApiProperty({ required: true })
  refreshToken: string

  constructor(tokens: { accessToken: string; refreshToken: string }) {
    this.accessToken = tokens.accessToken
    this.refreshToken = tokens.refreshToken
  }
}
