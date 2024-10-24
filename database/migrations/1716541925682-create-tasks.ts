import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTasks1716541925682 implements MigrationInterface {
  name = 'CreateTasks1716541925682'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tasks" ("id" SERIAL NOT NULL, "user_id" character varying(255) NOT NULL, "title" character varying(255) NOT NULL, "description" text, "status" smallint NOT NULL DEFAULT '3', "due_date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tasks"`)
  }
}
