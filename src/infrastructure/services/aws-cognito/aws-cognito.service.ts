import { Injectable } from '@nestjs/common'
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js'
import { CognitoIdentityServiceProvider } from 'aws-sdk'
import {
  IAwsCognitoService,
  ILoginResponse,
  ILoginUser,
} from 'src/domain/services/aws-cognito.interface'
import { EnvironmentConfigService } from 'src/infrastructure/config/environment/environment-config.service'

@Injectable()
export class AwsCognitoService implements IAwsCognitoService {
  private clientID: string
  private cognitoProvider: CognitoIdentityServiceProvider
  private userPool: CognitoUserPool

  constructor(configService: EnvironmentConfigService) {
    this.clientID = configService.getAwsCognitoClientId()

    this.userPool = new CognitoUserPool({
      UserPoolId: configService.getAwsCognitoUserPoolId(),
      ClientId: this.clientID,
    })

    this.cognitoProvider = new CognitoIdentityServiceProvider({
      region: configService.getAwsRegion(),
    })
  }

  async authenticateUser({
    email,
    password,
  }: ILoginUser): Promise<ILoginResponse> {
    const userCognito = new CognitoUser({
      Username: email,
      Pool: this.userPool,
    })

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    })

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({
            idToken: result.getIdToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          })
        },
        onFailure: (err) => {
          reject(err)
        },
      })
    })
  }

  async getNewIdToken(refreshToken: string): Promise<string> {
    const result = await this.cognitoProvider
      .initiateAuth({
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: this.clientID,
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
        },
      })
      .promise()

    const { IdToken: idToken } = result.AuthenticationResult
    return idToken
  }
}
