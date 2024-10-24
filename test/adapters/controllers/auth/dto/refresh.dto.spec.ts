import { validate } from 'class-validator'
import { RefreshDto } from 'src/adapters/controllers/auth/dto/refresh.dto'

describe('RefreshDto', () => {
  let dto: RefreshDto

  beforeEach(() => {
    dto = new RefreshDto()
  })

  describe('refreshToken', () => {
    it('should validate refreshToken property', async () => {
      dto.refreshToken = 'validToken'
      const errors = await validate(dto)
      expect(errors.length).toEqual(0)
    })

    it('should return an error when refreshToken is empty', async () => {
      dto.refreshToken = ''
      const errors = await validate(dto)
      expect(errors.length).toBeGreaterThan(0)
    })

    it('should return an error when refreshToken is number', async () => {
      dto.refreshToken = 123 as unknown as string
      const errors = await validate(dto)
      expect(errors.length).toBeGreaterThan(0)
    })
  })
})
