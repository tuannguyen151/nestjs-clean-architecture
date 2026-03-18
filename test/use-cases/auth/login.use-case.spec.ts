import { Test, type TestingModule } from '@nestjs/testing'

import { RoleEnum, type UserEntity } from '@domain/entities/user.entity'
import { IException } from '@domain/exceptions/exceptions.interface'
import { IUserRepository } from '@domain/repositories/user.repository.interface'
import { IBcryptService } from '@domain/services/bcrypt.interface'
import { IJwtService } from '@domain/services/jwt.interface'

import { LoginUseCase } from '@use-cases/auth/login.use-case'

describe('LoginUseCase', () => {
  let useCase: LoginUseCase
  let userRepository: IUserRepository
  let bcryptService: IBcryptService
  let jwtService: IJwtService
  let exceptionsService: IException

  const mockUser = {
    id: 1,
    username: 'testuser',
    hashedPassword: 'hashedpassword',
    role: RoleEnum.User,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as UserEntity

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: IUserRepository,
          useValue: {
            getUserByUsername: jest.fn(),
            updateLastLogin: jest.fn(),
          },
        },
        {
          provide: IBcryptService,
          useValue: {
            compare: jest.fn(),
          },
        },
        {
          provide: IJwtService,
          useValue: {
            createToken: jest.fn(),
          },
        },
        {
          provide: IException,
          useValue: {
            badRequestException: jest.fn((err: { message: string }) => {
              throw new Error(err.message)
            }),
          },
        },
      ],
    }).compile()

    useCase = module.get<LoginUseCase>(LoginUseCase)
    userRepository = module.get<IUserRepository>(IUserRepository)
    bcryptService = module.get<IBcryptService>(IBcryptService)
    jwtService = module.get<IJwtService>(IJwtService)
    exceptionsService = module.get<IException>(IException)
  })

  it('should successfully login a user and return tokens', async () => {
    const payload = {
      username: 'testuser',
      password: 'Password123!',
    }
    const accessExpiresAt = new Date()
    const refreshExpiresAt = new Date()

    jest.spyOn(userRepository, 'getUserByUsername').mockResolvedValue(mockUser)
    jest.spyOn(bcryptService, 'compare').mockResolvedValue(true)
    jest
      .spyOn(jwtService, 'createToken')
      .mockResolvedValueOnce({
        token: 'mockAccessToken',
        expiresAt: accessExpiresAt,
      })
      .mockResolvedValueOnce({
        token: 'mockRefreshToken',
        expiresAt: refreshExpiresAt,
      })
    jest.spyOn(userRepository, 'updateLastLogin').mockResolvedValue(undefined)

    const result = await useCase.execute(payload)

    expect(userRepository.getUserByUsername).toHaveBeenCalledWith(
      payload.username,
    )
    expect(bcryptService.compare).toHaveBeenCalledWith(
      payload.password,
      mockUser.hashedPassword,
    )
    expect(jwtService.createToken).toHaveBeenCalledTimes(2)
    expect(userRepository.updateLastLogin).toHaveBeenCalledWith(mockUser.id)
    expect(result).toEqual({
      accessToken: 'mockAccessToken',
      accessExpiresAt,
      refreshToken: 'mockRefreshToken',
      refreshExpiresAt,
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
