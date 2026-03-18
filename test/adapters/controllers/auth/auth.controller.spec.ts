import { Test, TestingModule } from '@nestjs/testing'

import type { Response } from 'express'

import { RoleEnum, UserEntity } from '@domain/entities/user.entity'

import { LoginUseCase } from '@use-cases/auth/login.use-case'
import { RefreshUseCase } from '@use-cases/auth/refresh.use-case'

import { AuthController } from '@adapters/controllers/auth/auth.controller'
import { LoginDto } from '@adapters/controllers/auth/dto/login.dto'
import { LoginPresenter } from '@adapters/controllers/auth/presenters/login.presenter'
import { RefreshPresenter } from '@adapters/controllers/auth/presenters/refresh.presenter'

describe('AuthController', () => {
  let controller: AuthController
  let loginUseCase: LoginUseCase
  let refreshUseCase: RefreshUseCase

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: RefreshUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    loginUseCase = module.get<LoginUseCase>(LoginUseCase)
    refreshUseCase = module.get<RefreshUseCase>(RefreshUseCase)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  const mockUser = {
    id: 1,
    username: 'testuser',
    hashedPassword: 'hashedpassword',
    role: RoleEnum.User,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as UserEntity

  const mockRes = {
    cookie: jest.fn(),
  } as unknown as Response

  describe('login', () => {
    it('should return a LoginPresenter', async () => {
      const loginDto: LoginDto = {
        username: 'user@example.com',
        password: 'password',
      }
      const accessExpiresAt = new Date()
      const refreshExpiresAt = new Date()
      const tokens = {
        accessToken: 'mockAccessToken',
        accessExpiresAt,
        refreshToken: 'mockRefreshToken',
        refreshExpiresAt,
      }
      const loginPresenter = new LoginPresenter(tokens)
      jest.spyOn(loginUseCase, 'execute').mockResolvedValue(tokens)

      const result = await controller.login(loginDto, mockRes)

      expect(result).toEqual(loginPresenter)
      expect(loginUseCase.execute).toHaveBeenCalledWith(loginDto)
    })

    it('should throw an error if loginUseCase.execute throws an error', async () => {
      const loginDto: LoginDto = {
        username: 'user@example.com',
        password: 'password',
      }
      jest.spyOn(loginUseCase, 'execute').mockImplementation(() => {
        throw new Error('Test error')
      })

      await expect(controller.login(loginDto, mockRes)).rejects.toThrow(Error)
    })
  })

  describe('refresh', () => {
    it('should return a RefreshPresenter', async () => {
      const userId = mockUser.id
      const accessExpiresAt = new Date()
      const refreshExpiresAt = new Date()
      const tokens = {
        accessToken: 'mockNewAccessToken',
        accessExpiresAt,
        refreshToken: 'mockNewRefreshToken',
        refreshExpiresAt,
      }
      const refreshPresenter = new RefreshPresenter(tokens)
      jest.spyOn(refreshUseCase, 'execute').mockResolvedValue(tokens)

      const result = await controller.refresh(userId, mockRes)

      expect(result).toEqual(refreshPresenter)
      expect(refreshUseCase.execute).toHaveBeenCalledWith({
        userId: userId,
      })
    })

    it('should throw an error if getNewIdTokenUseCase.execute throws an error', async () => {
      const userId = mockUser.id
      jest.spyOn(refreshUseCase, 'execute').mockImplementation(() => {
        throw new Error('Test error')
      })

      await expect(controller.refresh(userId, mockRes)).rejects.toThrow(Error)
    })
  })
})
