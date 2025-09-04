import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductsTableMigration1756956871034 implements MigrationInterface {
  name = 'ProductsTableMigration1756956871034';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "product" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "external_id" character varying NOT NULL,
                "published_version" integer NOT NULL,
                "revision" integer NOT NULL,
                "sku" character varying(128) NOT NULL,
                "name" character varying(255) NOT NULL,
                "brand" character varying(128) NOT NULL,
                "model" character varying(128) NOT NULL,
                "category" character varying(128) NOT NULL,
                "color" character varying(128) NOT NULL,
                "price" numeric(10, 4) NOT NULL,
                "currency" character varying(3) NOT NULL,
                "stock" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_867bdcdb793f0d230bae5ab548" ON "product" ("external_id")
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_34f6ca1cd897cc926bdcca1ca3" ON "product" ("sku")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_34f6ca1cd897cc926bdcca1ca3"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_867bdcdb793f0d230bae5ab548"
        `);
    await queryRunner.query(`
            DROP TABLE "product"
        `);
  }
}
