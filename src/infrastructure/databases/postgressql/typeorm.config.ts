/* eslint-disable no-console */
import dotenv from 'dotenv'
import { DataSource } from 'typeorm'

dotenv.config({ path: '.env' })

const dataSource = new DataSource({
  type: process.env.DATABASE_ENGINE as 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  schema: process.env.DATABASE_SCHEMA,
  migrationsRun: false,
  migrations: ['database/migrations/**/*{.ts,.js}'],
  subscribers: ['src/migrations'],
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
