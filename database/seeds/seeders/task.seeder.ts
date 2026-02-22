import { DataSource } from 'typeorm'
import type { Seeder, SeederFactoryManager } from 'typeorm-extension'

import { Task } from '@infrastructure/databases/postgressql/entities/task.entity'
import { User } from '@infrastructure/databases/postgressql/entities/user.entity'

const SEED_TASKS_PER_USER = 5

export default class TaskSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const userRepository = dataSource.getRepository(User)
    const users = await userRepository.find()

    const taskFactory = factoryManager.get(Task)

    for (const user of users) {
      await taskFactory.saveMany(SEED_TASKS_PER_USER, { userId: user.id })
    }
  }
}
