import { DataSource } from 'typeorm'
import type { Seeder, SeederFactoryManager } from 'typeorm-extension'

import { RoleEnum } from '@domain/entities/user.entity'

import { User } from '@infrastructure/databases/postgresql/entities/user.entity'
import { BcryptService } from '@infrastructure/services/bcrypt/bcrypt.service'

const DEFAULT_ADMIN_USERNAME = 'admin'
const DEFAULT_USER_USERNAME = 'user'

const SEED_USERS_COUNT = 8
const DEFAULT_PASSWORD = 'password'

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const userRepository = dataSource.getRepository(User)

    const hashedPassword = await new BcryptService().hash(DEFAULT_PASSWORD)

    await userRepository.upsert(
      {
        username: DEFAULT_ADMIN_USERNAME,
        password: hashedPassword,
        role: RoleEnum.Admin,
      },
      ['username'],
    )
    await userRepository.upsert(
      {
        username: DEFAULT_USER_USERNAME,
        password: hashedPassword,
        role: RoleEnum.User,
      },
      ['username'],
    )

    const userFactory = factoryManager.get(User)
    await userFactory.saveMany(SEED_USERS_COUNT, { password: hashedPassword })
  }
}
