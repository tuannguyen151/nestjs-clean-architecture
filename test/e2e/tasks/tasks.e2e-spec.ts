import { type INestApplication } from '@nestjs/common'

import request from 'supertest'

import { createE2EApp } from '../setup/app.factory'
import { clearDatabase, runMigrations, seedUser } from '../setup/db.helper'

describe('Tasks (E2E)', () => {
  let app: INestApplication
  let accessToken: string

  const inputUser = { username: 'tasks-e2e-user', password: 'Test@1234' }

  beforeAll(async () => {
    app = await createE2EApp()
    await runMigrations(app)
    await clearDatabase(app)
    await seedUser(app, inputUser.username, inputUser.password)

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send(inputUser)

    accessToken = loginRes.body.data.accessToken as string
  })

  afterAll(async () => {
    await clearDatabase(app)
    await app.close()
  })

  describe('GET /api/v1/tasks', () => {
    it('should return 401 when no token provided', async () => {
      await request(app.getHttpServer()).get('/api/v1/tasks').expect(401)
    })

    it('should return 200 with empty list for authenticated user', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response.body.data).toBeInstanceOf(Array)
    })
  })

  describe('POST /api/v1/tasks', () => {
    it('should return 401 when no token provided', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/tasks')
        .send({ title: 'Test task' })
        .expect(401)
    })

    it('should create a task and return it', async () => {
      const inputTask = {
        title: 'E2E Test Task',
        description: 'Created in E2E test',
      }

      const response = await request(app.getHttpServer())
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(inputTask)
        .expect(201)

      const actualTask = response.body.data
      expect(actualTask).toHaveProperty('id')
      expect(actualTask.title).toBe(inputTask.title)
      expect(actualTask.description).toBe(inputTask.description)
    })
  })

  describe('GET /api/v1/tasks/:id', () => {
    let taskId: number

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Task for detail test' })

      taskId = response.body.data.id as number
    })

    it('should return task detail', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response.body.data.id).toBe(taskId)
    })

    it('should return 404 when task does not exist', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/tasks/999999')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
    })
  })
})
