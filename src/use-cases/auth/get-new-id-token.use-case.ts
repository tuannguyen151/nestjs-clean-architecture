import { Inject } from '@nestjs/common'
import {
  EXCEPTIONS,
  IException,
} from 'src/domain/exceptions/exceptions.interface'
import {
  AWS_COGNITO_SERVICE,
  IAwsCognitoService,
} from 'src/domain/services/aws-cognito.interface'

export class GetNewIdTokenUseCase {
  constructor(
    @Inject(AWS_COGNITO_SERVICE)
    private readonly awsCognitoService: IAwsCognitoService,
    @Inject(EXCEPTIONS)
    private readonly exceptionsService: IException,
  ) {}

  async execute(refreshToken: string): Promise<string> {
    try {
      return await this.awsCognitoService.getNewIdToken(refreshToken)
    } catch (error: unknown) {
      this.exceptionsService.unauthorizedException({
        type: (error as Error).name,
        message: (error as Error).message,
      })
    }
  }
}
