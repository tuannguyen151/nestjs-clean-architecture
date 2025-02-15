import { Module } from '@nestjs/common'

import { EXCEPTIONS } from '@domain/exceptions/exceptions.interface'
import { AWS_COGNITO_SERVICE } from '@domain/services/aws-cognito.interface'

import { GetNewIdTokenUseCase } from '@use-cases/auth/get-new-id-token.use-case'
import { LoginUseCase } from '@use-cases/auth/login.use-case'

import { AuthController } from '@adapters/controllers/auth/auth.controller'

import { EnvironmentConfigModule } from '@infrastructure/config/environment/environment-config.module'
import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service'
import { AwsCognitoModule } from '@infrastructure/services/aws-cognito/aws-cognito.module'
import { AwsCognitoService } from '@infrastructure/services/aws-cognito/aws-cognito.service'

@Module({
  imports: [AwsCognitoModule, EnvironmentConfigModule],
  controllers: [AuthController],
  providers: [
    {
      provide: AWS_COGNITO_SERVICE,
      useClass: AwsCognitoService,
    },
    {
      provide: EXCEPTIONS,
      useClass: ExceptionsService,
    },

    LoginUseCase,
    GetNewIdTokenUseCase,
  ],
})
export class AuthModule {}
