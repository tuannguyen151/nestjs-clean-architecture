import { Module } from '@nestjs/common'
import { AuthController } from 'src/adapters/controllers/auth/auth.controller'
import { EXCEPTIONS } from 'src/domain/exceptions/exceptions.interface'
import { AWS_COGNITO_SERVICE } from 'src/domain/services/aws-cognito.interface'
import { EnvironmentConfigModule } from 'src/infrastructure/config/environment/environment-config.module'
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service'
import { AwsCognitoModule } from 'src/infrastructure/services/aws-cognito/aws-cognito.module'
import { AwsCognitoService } from 'src/infrastructure/services/aws-cognito/aws-cognito.service'
import { GetNewIdTokenUseCase } from 'src/use-cases/auth/get-new-id-token.use-case'
import { LoginUseCase } from 'src/use-cases/auth/login.use-case'

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
