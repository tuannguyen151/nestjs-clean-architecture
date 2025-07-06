import { validate } from 'class-validator'

import { LoginDto } from '@adapters/controllers/auth/dto/login.dto'

describe('LoginDto', () => {
  let dto: LoginDto

  beforeEach(() => {
    dto = new LoginDto()
  })

  describe('username', () => {
    beforeEach(() => {
      dto.password = 'password'
    })

    it('should validate username property', async () => {
      dto.username = 'user@example.com'

      const errors = await validate(dto)
      expect(errors.length).toEqual(0)
    })

    it('should return an error when username is empty (isNotEmpy)', async () => {
      dto.username = ''
      const errors = await validate(dto)
      expect(errors.length).toBeGreaterThan(0)
    })
  })

  describe('password', () => {
    beforeEach(() => {
      // username must be set for password validation to be isolated
      dto.username = 'testuser'
    })

    it('should validate password property', async () => {
      dto.password = 'password'

      const errors = await validate(dto)
      expect(errors.length).toEqual(0)
    })

    it('should return an error when password is empty', async () => {
      dto.password = ''
      const errors = await validate(dto)
      expect(errors.length).toBeGreaterThan(0)
    })
  })
})
