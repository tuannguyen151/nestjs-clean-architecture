import { Module } from '@nestjs/common'

import { EnvironmentConfigModule } from '@infrastructure/config/environment/environment-config.module'

import { AwsCognitoService } from './aws-cognito.service'

@Module({
  imports: [EnvironmentConfigModule],
  providers: [AwsCognitoService],
  exports: [AwsCognitoService],
})
export class AwsCognitoModule {}
