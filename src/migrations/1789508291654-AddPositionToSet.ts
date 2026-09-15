import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPositionToSet1789508291654 implements MigrationInterface {
    name = 'AddPositionToSet1789508291654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sets" ADD "position" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`
            UPDATE "sets"
            SET "position" = subquery.pos - 1
            FROM (
                SELECT "id", ROW_NUMBER() OVER (PARTITION BY "microCycleItemId", "exerciseId" ORDER BY "id") as pos
                FROM "sets"
            ) AS subquery
            WHERE "sets"."id" = subquery."id"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sets" DROP COLUMN "position"`);
    }
}
