import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIndexForUserIdInTasks1717041705278
  implements MigrationInterface
{
  name = 'AddIndexForUserIdInTasks1717041705278'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_tasks_user_id " ON "tasks" ("user_id") `,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_tasks_user_id "`)
  }
}
