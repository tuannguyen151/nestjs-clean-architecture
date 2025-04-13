/* eslint-disable import/named */
import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddRoleToUsers1744508958824 implements MigrationInterface {
  name = 'AddRoleToUsers1744508958824'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "role" smallint NOT NULL DEFAULT '1'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`)
  }
}
