import { Test, TestingModule } from '@nestjs/testing'

import { RoleEnum } from '@domain/entities/role.entity'
import { UserEntity } from '@domain/entities/user.entity'
import { IException } from '@domain/exceptions/exceptions.interface'

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

  const mockUser: UserEntity = {
    id: 1,
    username: 'testuser',
    password: 'hashedpassword',
    role: RoleEnum.User,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  describe('login', () => {
    it('should return a LoginPresenter', async () => {
      const loginDto: LoginDto = {
        username: 'user@example.com',
        password: 'password',
      }
      const tokens = {
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      }
      const loginPresenter = new LoginPresenter({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      })
      jest.spyOn(loginUseCase, 'execute').mockResolvedValue(tokens)

      const result = await controller.login(loginDto)

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

      await expect(controller.login(loginDto)).rejects.toThrow(Error)
    })
  })

  describe('refresh', () => {
    it('should return a RefreshPresenter', async () => {
      const userId = mockUser.id
      const tokens = {
        accessToken: 'mockNewAccessToken',
        refreshToken: 'mockNewRefreshToken',
      }
      const refreshPresenter = new RefreshPresenter({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      })
      jest.spyOn(refreshUseCase, 'execute').mockResolvedValue(tokens)

      const result = await controller.refresh(userId)

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

      await expect(controller.refresh(userId)).rejects.toThrow(Error)
    })
  })
})
