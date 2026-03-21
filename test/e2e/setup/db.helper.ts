import { type INestApplication } from '@nestjs/common'

import { DataSource } from 'typeorm'

import { RoleEnum } from '@domain/entities/user.entity'
import { IBcryptService } from '@domain/services/bcrypt.interface'

import { User } from '@infrastructure/databases/postgresql/entities/user.entity'

export async function runMigrations(app: INestApplication): Promise<void> {
  const dataSource = app.get(DataSource)
  await dataSource.runMigrations()
}

export async function clearDatabase(app: INestApplication): Promise<void> {
  const dataSource = app.get(DataSource)
  const entities = dataSource.entityMetadatas

  for (const entity of entities) {
    await dataSource.query(
      `TRUNCATE "${entity.tableName}" RESTART IDENTITY CASCADE`,
    )
  }
}

export async function seedUser(
  app: INestApplication,
  username: string,
  password: string,
  role = RoleEnum.User,
): Promise<User> {
  const dataSource = app.get(DataSource)
  const bcrypt = app.get<IBcryptService>(IBcryptService)
  const hashedPassword = await bcrypt.hash(password)

  return dataSource
    .getRepository(User)
    .save({ username, password: hashedPassword, role })
}
