export interface ILoginUser {
  email: string
  password: string
}

export interface ILoginResponse {
  idToken: string
  refreshToken: string
}

export const AWS_COGNITO_SERVICE = 'IAwsCognitoService'
export interface IAwsCognitoService {
  authenticateUser(payload: ILoginUser): Promise<ILoginResponse>
  getNewIdToken(refreshToken: string): Promise<string>
}
