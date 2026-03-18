import { Test, type TestingModule } from '@nestjs/testing'

import { environmentConfigServiceMock } from 'test/mocks/services/environment-config-service.mock'

import { IJwtConfig } from '@domain/config/jwt.interface'
import { RoleEnum, UserEntity } from '@domain/entities/user.entity'
import { IException } from '@domain/exceptions/exceptions.interface'
import { ILogger } from '@domain/logger/logger.interface'
import { IUserRepository } from '@domain/repositories/user.repository.interface'
import type { IJwtServicePayload } from '@domain/services/jwt.interface'

import { JwtStrategy } from '@infrastructure/common/strategies/jwt.strategy'

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy
  let userRepository: IUserRepository
  let exceptionsService: { unauthorizedException: jest.Mock }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ILogger,
          useValue: { warn: jest.fn() },
        },
        {
          provide: IException,
          useValue: {
            unauthorizedException: jest.fn(() => {
              throw new Error('Unauthorized')
            }),
          },
        },
        {
          provide: IJwtConfig,
          useValue: environmentConfigServiceMock,
        },
        {
          provide: IUserRepository,
          useValue: { getUserById: jest.fn() },
        },
      ],
    }).compile()

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy)
    userRepository = module.get<IUserRepository>(IUserRepository)
    exceptionsService = module.get(IException)
  })

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined()
  })

  it('should validate payload and return user if user exists', async () => {
    const payload: IJwtServicePayload = { id: 1 }
    const mockUser = new UserEntity(
      1,
      'test',
      'pwd',
      RoleEnum.User,
      new Date(),
      new Date(),
    )
    jest.spyOn(userRepository, 'getUserById').mockResolvedValue(mockUser)

    const result = await jwtStrategy.validate(payload)

    expect(userRepository.getUserById).toHaveBeenCalledWith(payload.id)
    expect(result).toEqual(mockUser)
  })

  it('should throw unauthorized exception if user does not exist', async () => {
    const payload: IJwtServicePayload = { id: 1 }
    jest.spyOn(userRepository, 'getUserById').mockResolvedValue(null)

    await expect(jwtStrategy.validate(payload)).rejects.toThrow('Unauthorized')
    expect(userRepository.getUserById).toHaveBeenCalledWith(payload.id)
    expect(exceptionsService.unauthorizedException).toHaveBeenCalledWith({
      type: 'Unauthorized',
      message: 'User not found',
    })
  })
})
