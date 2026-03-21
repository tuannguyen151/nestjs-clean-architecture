import { type INestApplication } from '@nestjs/common'

import request from 'supertest'

import { createE2EApp } from '../setup/app.factory'
import { clearDatabase, runMigrations, seedUser } from '../setup/db.helper'

describe('Auth (E2E)', () => {
  let app: INestApplication

  const inputUser = { username: 'auth-e2e-user', password: 'Test@1234' }

  beforeAll(async () => {
    app = await createE2EApp()
    await runMigrations(app)
    await clearDatabase(app)
    await seedUser(app, inputUser.username, inputUser.password)
  })

  afterAll(async () => {
    await clearDatabase(app)
    await app.close()
  })

  describe('POST /api/v1/auth/login', () => {
    it('should return 400 when body is missing', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({})
        .expect(400)
    })

    it('should return 400 when credentials are invalid', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ username: inputUser.username, password: 'wrong-password' })
        .expect(400)
    })

    it('should return 400 when user does not exist', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ username: 'non-existent', password: inputUser.password })
        .expect(400)
    })

    it('should return 201 with tokens and set cookies on valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(inputUser)
        .expect(201)

      const actualData = response.body.data
      expect(actualData).toHaveProperty('accessToken')
      expect(actualData).toHaveProperty('refreshToken')
      expect(actualData).toHaveProperty('accessExpiresAt')
      expect(actualData).toHaveProperty('refreshExpiresAt')

      const cookies = response.headers['set-cookie'] as unknown as string[]
      expect(cookies.some((c: string) => c.startsWith('access_token='))).toBe(
        true,
      )
      expect(cookies.some((c: string) => c.startsWith('refresh_token='))).toBe(
        true,
      )
    })
  })

  describe('POST /api/v1/auth/refresh', () => {
    let refreshToken: string
    let refreshCookie: string

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(inputUser)

      refreshToken = response.body.data.refreshToken as string

      const cookies = response.headers['set-cookie'] as unknown as string[]
      refreshCookie =
        cookies.find((c: string) => c.startsWith('refresh_token=')) ?? ''
    })

    it('should return 401 when no refresh token provided', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .expect(401)
    })

    it('should return 200 with new tokens via Bearer header', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(201)

      const actualData = response.body.data
      expect(actualData).toHaveProperty('accessToken')
      expect(actualData).toHaveProperty('refreshToken')
    })

    it('should return 201 with new tokens via cookie', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Cookie', refreshCookie)
        .expect(201)

      const actualData = response.body.data
      expect(actualData).toHaveProperty('accessToken')
      expect(actualData).toHaveProperty('refreshToken')

      const cookies = response.headers['set-cookie'] as unknown as string[]
      expect(cookies.some((c: string) => c.startsWith('access_token='))).toBe(
        true,
      )
      expect(cookies.some((c: string) => c.startsWith('refresh_token='))).toBe(
        true,
      )
    })
  })
})
