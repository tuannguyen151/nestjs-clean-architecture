import { Test, TestingModule } from '@nestjs/testing'
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'
import { AwsCognitoService } from 'src/infrastructure/services/aws-cognito/aws-cognito.service'
import { EnvironmentConfigService } from 'src/infrastructure/config/environment/environment-config.service'
import { environmentConfigServiceMock } from 'test/mocks/services/environment-config-service.mock'
import {
  ID_TOKEN_MOCK,
  REFRESH_TOKEN_MOCK,
} from 'test/mocks/services/aws-cognito.service.mock'

jest.mock('amazon-cognito-identity-js', () => ({
  CognitoUserPool: jest.fn(),
  CognitoUser: jest.fn(),
  AuthenticationDetails: jest.fn(),
}))

const mockInitiateAuth = jest.fn()
jest.mock('aws-sdk', () => ({
  CognitoIdentityServiceProvider: jest.fn(() => ({
    initiateAuth: mockInitiateAuth,
  })),
}))

describe('AwsCognitoService', () => {
  let service: AwsCognitoService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsCognitoService,
        {
          provide: EnvironmentConfigService,
          useValue: environmentConfigServiceMock,
        },
      ],
    }).compile()

    service = module.get<AwsCognitoService>(AwsCognitoService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('authenticateUser', () => {
    const email = 'test@example.com'
    const password = 'password123'
    const loginUser = { email, password }

    let mockCognitoUser: { authenticateUser: jest.Mock }

    beforeEach(() => {
      mockCognitoUser = {
        authenticateUser: jest.fn(),
      }
      ;(CognitoUser as jest.Mock).mockImplementation(() => mockCognitoUser)
      ;(AuthenticationDetails as jest.Mock).mockImplementation(() => ({}))
    })

    it('should authenticate user successfully', async () => {
      mockCognitoUser.authenticateUser.mockImplementation(
        (authDetails, callbacks) => {
          callbacks.onSuccess({
            getIdToken: () => ({ getJwtToken: () => ID_TOKEN_MOCK }),
            getRefreshToken: () => ({ getToken: () => REFRESH_TOKEN_MOCK }),
          })
        },
      )

      const result = await service.authenticateUser(loginUser)

      expect(result).toEqual({
        idToken: ID_TOKEN_MOCK,
        refreshToken: REFRESH_TOKEN_MOCK,
      })
      expect(CognitoUser).toHaveBeenCalledWith({
        Username: email,
        Pool: expect.anything(),
      })
      expect(AuthenticationDetails).toHaveBeenCalledWith({
        Username: email,
        Password: password,
      })
      expect(mockCognitoUser.authenticateUser).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
      )
    })

    it('should throw an error on authentication failure', async () => {
      mockCognitoUser.authenticateUser.mockImplementation(
        (authDetails, callbacks) => {
          callbacks.onFailure(new Error('Authentication failed'))
        },
      )

      await expect(service.authenticateUser(loginUser)).rejects.toThrow(
        'Authentication failed',
      )
      expect(CognitoUser).toHaveBeenCalledWith({
        Username: email,
        Pool: expect.anything(),
      })
      expect(AuthenticationDetails).toHaveBeenCalledWith({
        Username: email,
        Password: password,
      })
      expect(mockCognitoUser.authenticateUser).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
      )
    })
  })

  describe('getNewIdToken', () => {
    it('should return a new access token', async () => {
      mockInitiateAuth.mockImplementation(() => ({
        promise: jest.fn().mockResolvedValue({
          AuthenticationResult: {
            IdToken: ID_TOKEN_MOCK,
          },
        }),
      }))

      const result = await service.getNewIdToken(REFRESH_TOKEN_MOCK)

      expect(result).toBe(ID_TOKEN_MOCK)
      expect(mockInitiateAuth).toHaveBeenCalledWith({
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: environmentConfigServiceMock.getAwsCognitoClientId(),
        AuthParameters: {
          REFRESH_TOKEN: REFRESH_TOKEN_MOCK,
        },
      })
    })

    it('should throw an error if authentication fails', async () => {
      mockInitiateAuth.mockImplementation(() => ({
        promise: jest
          .fn()
          .mockRejectedValue(new Error('Authentication failed')),
      }))

      await expect(service.getNewIdToken(REFRESH_TOKEN_MOCK)).rejects.toThrow(
        'Authentication failed',
      )
    })
  })
})
