import { Test, TestingModule } from '@nestjs/testing'

import { RoleEnum } from '@domain/entities/role.entity'
import { UserEntity } from '@domain/entities/user.entity'
import { EXCEPTIONS, IException } from '@domain/exceptions/exceptions.interface'
import {
  IUserRepository,
  USER_REPOSITORY,
} from '@domain/repositories/user.repository.interface'
import {
  BCRYPT_SERVICE,
  IBcryptService,
} from '@domain/services/bcrypt.interface'
import { IJwtService, JWT_SERVICE } from '@domain/services/jwt.interface'

import { LoginUseCase } from '@use-cases/auth/login.use-case'

describe('LoginUseCase', () => {
  let useCase: LoginUseCase
  let userRepository: IUserRepository
  let bcryptService: IBcryptService
  let jwtService: IJwtService
  let exceptionsService: IException

  const mockUser: UserEntity = {
    id: 1,
    username: 'testuser',
    password: 'hashedpassword',
    role: RoleEnum.User,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: {
            getUserByUsername: jest.fn(),
            updateLastLogin: jest.fn(),
          },
        },
        {
          provide: BCRYPT_SERVICE,
          useValue: {
            compare: jest.fn(),
          },
        },
        {
          provide: JWT_SERVICE,
          useValue: {
            createToken: jest.fn(),
          },
        },
        {
          provide: EXCEPTIONS,
          useValue: {
            badRequestException: jest.fn((err: { message: string }) => {
              throw new Error(err.message)
            }),
          },
        },
      ],
    }).compile()

    useCase = module.get<LoginUseCase>(LoginUseCase)
    userRepository = module.get<IUserRepository>(USER_REPOSITORY)
    bcryptService = module.get<IBcryptService>(BCRYPT_SERVICE)
    jwtService = module.get<IJwtService>(JWT_SERVICE)
    exceptionsService = module.get<IException>(EXCEPTIONS)
  })

  it('should successfully login a user and return tokens', async () => {
    const payload = {
      username: 'testuser',
      password: 'Password123!',
    }
    jest.spyOn(userRepository, 'getUserByUsername').mockResolvedValue(mockUser)
    jest.spyOn(bcryptService, 'compare').mockResolvedValue(true)
    jest
      .spyOn(jwtService, 'createToken')
      .mockResolvedValueOnce('mockAccessToken')
      .mockResolvedValueOnce('mockRefreshToken')
    jest.spyOn(userRepository, 'updateLastLogin').mockResolvedValue(undefined)

    const result = await useCase.execute(payload)

    expect(userRepository.getUserByUsername).toHaveBeenCalledWith(
      payload.username,
    )
    expect(bcryptService.compare).toHaveBeenCalledWith(
      payload.password,
      mockUser.password,
    )
    expect(jwtService.createToken).toHaveBeenCalledTimes(2)
    expect(userRepository.updateLastLogin).toHaveBeenCalledWith(mockUser.id)
    expect(result).toEqual({
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    })
  })

  it('should throw badRequestException if user not found', async () => {
    const payload = {
      username: 'unknownuser',
      password: 'Password123!',
    }
    jest.spyOn(userRepository, 'getUserByUsername').mockResolvedValue(null)

    await expect(useCase.execute(payload)).rejects.toThrow('User not found')
    expect(exceptionsService.badRequestException).toHaveBeenCalledWith({
      type: 'BadRequest',
      message: 'User not found',
    })
  })

  it('should throw badRequestException if password does not match', async () => {
    const payload = {
      username: 'testuser',
      password: 'wrongpassword',
    }
    jest.spyOn(userRepository, 'getUserByUsername').mockResolvedValue(mockUser)
    jest.spyOn(bcryptService, 'compare').mockResolvedValue(false)

    await expect(useCase.execute(payload)).rejects.toThrow(
      'Password is incorrect',
    )
    expect(exceptionsService.badRequestException).toHaveBeenCalledWith({
      type: 'BadRequest',
      message: 'Password is incorrect',
    })
  })
})
