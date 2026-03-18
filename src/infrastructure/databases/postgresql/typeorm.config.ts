/* eslint-disable no-console */
import dotenv from 'dotenv'
// eslint-disable-next-line import/no-unresolved
import { type SeederOptions } from 'node_modules/typeorm-extension/dist/seeder'
import { DataSource } from 'typeorm'

dotenv.config({ path: '.env' })

function parseDbEngine(value: string | undefined): 'postgres' {
  if (value !== 'postgres')
    throw new Error(`Unsupported database engine: ${String(value)}`)
  return value
}

const seederOptions: SeederOptions = {
  seeds: [__dirname + '/../../../../database/seeds/main{.ts,.js}'],
  factories: [
    __dirname + '/../../../../database/seeds/factories/**/*{.ts,.js}',
  ],
}

const dataSource = new DataSource({
  type: parseDbEngine(process.env['DATABASE_ENGINE']),
  host: process.env['DATABASE_HOST'],
  port: Number.parseInt(process.env['DATABASE_PORT'] ?? '5432'),
  username: process.env['DATABASE_USER'],
  password: process.env['DATABASE_PASSWORD'],
  database: process.env['DATABASE_NAME'],
  entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
  synchronize: false,
  schema: process.env['DATABASE_SCHEMA'],
  migrationsRun: false,
  migrations: [__dirname + '/../../../../database/migrations/**/*{.ts,.js}'],
  subscribers: [__dirname + '/subscribers/**/*{.ts,.js}'],
  ...(process.env['NODE_ENV'] === 'production' ? {} : seederOptions),
})

dataSource
  .initialize()
  .then(() => {
    console.log('Database connected')
  })
  .catch((error) => {
    console.log('Database connection error', error)
  })

export default dataSource
