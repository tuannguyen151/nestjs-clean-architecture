import { Inject } from '@nestjs/common'

import { EXCEPTIONS, IException } from '@domain/exceptions/exceptions.interface'
import {
  AWS_COGNITO_SERVICE,
  IAwsCognitoService,
} from '@domain/services/aws-cognito.interface'

export class GetNewIdTokenUseCase {
  constructor(
    @Inject(AWS_COGNITO_SERVICE)
    private readonly awsCognitoService: IAwsCognitoService,
    @Inject(EXCEPTIONS)
    private readonly exceptionsService: IException,
  ) {}

  async execute(refreshToken: string) {
    try {
      return await this.awsCognitoService.getNewIdToken(refreshToken)
    } catch (error) {
      throw this.exceptionsService.unauthorizedException({
        type: (error as Error).name,
        message: (error as Error).message,
      })
    }
  }
}
