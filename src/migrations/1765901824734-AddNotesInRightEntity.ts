import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotesInRightEntity1765901824734 implements MigrationInterface {
    name = 'AddNotesInRightEntity1765901824734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sets" DROP COLUMN "notes"`);
        await queryRunner.query(`ALTER TABLE "workout_exercises" ADD "notes" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workout_exercises" DROP COLUMN "notes"`);
        await queryRunner.query(`ALTER TABLE "sets" ADD "notes" character varying(255)`);
    }

}
