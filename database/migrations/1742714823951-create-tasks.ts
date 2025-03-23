/* eslint-disable import/named */
import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTasks1742714823951 implements MigrationInterface {
  name = 'CreateTasks1742714823951'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tasks" ("id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "title" character varying(255) NOT NULL, "description" text, "status" smallint NOT NULL DEFAULT '3', "due_date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_tasks_id" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_tasks_user_id" ON "tasks" ("user_id") `,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_tasks_user_id"`)
    await queryRunner.query(`DROP TABLE "tasks"`)
  }
}
