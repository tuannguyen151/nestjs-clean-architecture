import { ApiProperty } from '@nestjs/swagger'

export class LoginPresenter {
  @ApiProperty({ required: true })
  accessToken: string

  @ApiProperty({ required: true })
  refreshToken: string

  @ApiProperty({ required: true })
  accessExpiresAt: Date

  @ApiProperty({ required: true })
  refreshExpiresAt: Date

  constructor(tokens: {
    accessToken: string
    refreshToken: string
    accessExpiresAt: Date
    refreshExpiresAt: Date
  }) {
    this.accessToken = tokens.accessToken
    this.refreshToken = tokens.refreshToken
    this.accessExpiresAt = tokens.accessExpiresAt
    this.refreshExpiresAt = tokens.refreshExpiresAt
  }
}
