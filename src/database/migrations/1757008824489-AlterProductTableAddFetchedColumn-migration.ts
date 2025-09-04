import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterProductTableAddFetchedColumnMigration1757008824489 implements MigrationInterface {
  name = 'AlterProductTableAddFetchedColumnMigration1757008824489';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product"
            ADD "fetched_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product" DROP COLUMN "fetched_at"
        `);
  }
}
