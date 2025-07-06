import { Test, TestingModule } from '@nestjs/testing'

import { environmentConfigServiceMock } from 'test/mocks/services/environment-config-service.mock'

import { RoleEnum } from '@domain/entities/role.entity'
import { UserEntity } from '@domain/entities/user.entity'
import { IJwtServicePayload } from '@domain/services/jwt.interface'

import { JwtStrategy } from '@infrastructure/common/strategies/jwt.strategy'
import { EnvironmentConfigService } from '@infrastructure/config/environment/environment-config.service'
import { UserRepository } from '@infrastructure/databases/postgressql/repositories/user.repository'
import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service'
import { LoggerService } from '@infrastructure/logger/logger.service'

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy
  let userRepository: UserRepository
  let exceptionsService: ExceptionsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: LoggerService,
          useValue: { warn: jest.fn() },
        },
        {
          provide: ExceptionsService,
          useValue: {
            unauthorizedException: jest.fn(() => {
              throw new Error('Unauthorized')
            }),
          },
        },
        {
          provide: EnvironmentConfigService,
          useValue: environmentConfigServiceMock,
        },
        {
          provide: UserRepository,
          useValue: { getUserById: jest.fn() },
        },
      ],
    }).compile()

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy)
    userRepository = module.get<UserRepository>(UserRepository)
    exceptionsService = module.get<ExceptionsService>(ExceptionsService)
  })

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined()
  })

  it('should validate payload and return user if user exists', async () => {
    const payload: IJwtServicePayload = { id: 1 }
    const mockUser: UserEntity = {
      id: 1,
      username: 'test',
      password: 'pwd',
      role: RoleEnum.User,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
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
