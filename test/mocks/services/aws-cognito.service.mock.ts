import { IAwsCognitoService } from 'src/domain/services/aws-cognito.interface'

export const ID_TOKEN_MOCK = 'id-token'
export const REFRESH_TOKEN_MOCK = 'refresh-token'

export const awsCognitoServiceMock: Partial<IAwsCognitoService> = {
  authenticateUser: jest.fn().mockReturnValue({
    idToken: ID_TOKEN_MOCK,
    refreshToken: REFRESH_TOKEN_MOCK,
  }),
  getNewIdToken: jest.fn().mockReturnValue(ID_TOKEN_MOCK),
}
