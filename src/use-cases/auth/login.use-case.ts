import { Inject, Injectable } from '@nestjs/common'
import {
  AWS_COGNITO_SERVICE,
  IAwsCognitoService,
  ILoginUser,
} from 'src/domain/services/aws-cognito.interface'
import {
  EXCEPTIONS,
  IException,
} from 'src/domain/exceptions/exceptions.interface'

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(AWS_COGNITO_SERVICE)
    private readonly awsCognitoService: IAwsCognitoService,
    @Inject(EXCEPTIONS)
    private readonly exceptionsService: IException,
  ) {}

  async execute(payload: ILoginUser) {
    try {
      return await this.awsCognitoService.authenticateUser(payload)
    } catch (error: unknown) {
      this.exceptionsService.badRequestException({
        type: (error as Error).name,
        message: (error as Error).message,
      })
    }
  }
}
