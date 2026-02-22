import { DataSource } from 'typeorm'
import { type Seeder, runSeeder } from 'typeorm-extension'

import TaskSeeder from './seeders/task.seeder'
import UserSeeder from './seeders/user.seeder'

export default class MainSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await runSeeder(dataSource, UserSeeder)
    await Promise.all([runSeeder(dataSource, TaskSeeder)])
  }
}
