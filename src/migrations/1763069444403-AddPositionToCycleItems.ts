import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPositionToCycleItems1763069444403 implements MigrationInterface {
    name = 'AddPositionToCycleItems1763069444403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workout_exercises" ADD "position" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "micro_cycle_item" ADD "position" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "macro_cycle" DROP COLUMN "macroCycleName"`);
        await queryRunner.query(`ALTER TABLE "macro_cycle" ADD "macroCycleName" character varying(50) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "macro_cycle" DROP COLUMN "macroCycleName"`);
        await queryRunner.query(`ALTER TABLE "macro_cycle" ADD "macroCycleName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "micro_cycle_item" DROP COLUMN "position"`);
        await queryRunner.query(`ALTER TABLE "workout_exercises" DROP COLUMN "position"`);
    }

}
