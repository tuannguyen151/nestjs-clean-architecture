import { Test } from '@nestjs/testing'
import {
  IException,
  EXCEPTIONS,
} from 'src/domain/exceptions/exceptions.interface'
import {
  IAwsCognitoService,
  AWS_COGNITO_SERVICE,
} from 'src/domain/services/aws-cognito.interface'
import { GetNewIdTokenUseCase } from 'src/use-cases/auth/get-new-id-token.use-case'

describe('GetNewIdTokenUseCase', () => {
  let useCase: GetNewIdTokenUseCase
  let awsCognitoServiceMock: Partial<IAwsCognitoService>
  let exceptionsServiceMock: Partial<IException>

  beforeEach(async () => {
    awsCognitoServiceMock = {
      getNewIdToken: jest.fn().mockResolvedValue('newAccessToken'),
    }
    exceptionsServiceMock = {
      unauthorizedException: jest.fn(),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        GetNewIdTokenUseCase,
        {
          provide: AWS_COGNITO_SERVICE,
          useValue: awsCognitoServiceMock,
        },
        {
          provide: EXCEPTIONS,
          useValue: exceptionsServiceMock,
        },
      ],
    }).compile()

    useCase = moduleRef.get<GetNewIdTokenUseCase>(GetNewIdTokenUseCase)
  })

  describe('execute', () => {
    it('should return a new access token', async () => {
      const refreshToken = 'refreshToken'

      const result = await useCase.execute(refreshToken)

      expect(result).toBe('newAccessToken')
      expect(awsCognitoServiceMock.getNewIdToken).toHaveBeenCalledWith(
        refreshToken,
      )
      expect(exceptionsServiceMock.unauthorizedException).not.toHaveBeenCalled()
    })

    it('should call unauthorizedException when an error occurs', async () => {
      const refreshToken = 'refreshToken'
      const error = new Error('Unauthorized')

      awsCognitoServiceMock.getNewIdToken = jest.fn().mockRejectedValue(error)

      await useCase.execute(refreshToken)

      expect(awsCognitoServiceMock.getNewIdToken).toHaveBeenCalledWith(
        refreshToken,
      )
      expect(exceptionsServiceMock.unauthorizedException).toHaveBeenCalledWith({
        type: error.name,
        message: error.message,
      })
    })
  })
})
