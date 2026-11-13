import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCompletedAtToMicroCycleItem1794600320247 implements MigrationInterface {
    name = 'AddCompletedAtToMicroCycleItem1794600320247'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "micro_cycle_item" ADD "completedAt" TIMESTAMP`);
        await queryRunner.query(`
            UPDATE "micro_cycle_item"
            SET "completedAt" = "createdAt"
            WHERE "id" IN (SELECT DISTINCT "microCycleItemId" FROM "sets" WHERE "microCycleItemId" IS NOT NULL)
               OR "isSkipped" = true
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "micro_cycle_item" DROP COLUMN "completedAt"`);
    }
}
