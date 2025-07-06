/* eslint-disable import/named */
import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddPriorityToTasks1748624619778 implements MigrationInterface {
  name = 'AddPriorityToTasks1748624619778'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "priority" smallint NOT NULL DEFAULT '2'`,
    )
    // Update existing tasks to have medium priority (2)
    await queryRunner.query(
      `UPDATE "tasks" SET "priority" = 2 WHERE "priority" IS NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "priority"`)
  }
}
