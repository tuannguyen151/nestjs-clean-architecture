import { ApiProperty } from '@nestjs/swagger'

export class RefreshPresenter {
  @ApiProperty({ required: true })
  accessToken: string

  constructor({ accessToken }: RefreshPresenter) {
    this.accessToken = accessToken
  }
}
