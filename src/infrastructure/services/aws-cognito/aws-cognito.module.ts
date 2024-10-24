import { Module } from '@nestjs/common'
import { AwsCognitoService } from './aws-cognito.service'
import { EnvironmentConfigModule } from 'src/infrastructure/config/environment/environment-config.module'

@Module({
  imports: [EnvironmentConfigModule],
  providers: [AwsCognitoService],
  exports: [AwsCognitoService],
})
export class AwsCognitoModule {}
