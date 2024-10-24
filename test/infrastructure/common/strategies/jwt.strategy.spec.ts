import { Test, TestingModule } from '@nestjs/testing'
import { JwtStrategy } from 'src/infrastructure/common/strategies/jwt.strategy'
import { EnvironmentConfigService } from 'src/infrastructure/config/environment/environment-config.service'
import { environmentConfigServiceMock } from 'test/mocks/services/environment-config-service.mock'

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: EnvironmentConfigService,
          useValue: environmentConfigServiceMock,
        },
      ],
    }).compile()

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy)
  })

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined()
  })

  it('should validate payload correctly', async () => {
    const payload = { sub: 'user123' }
    const validatedUser = await jwtStrategy.validate(payload)
    expect(validatedUser).toEqual({ userId: 'user123' })
  })
})
