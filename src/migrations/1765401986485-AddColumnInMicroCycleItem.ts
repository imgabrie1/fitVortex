import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnInMicroCycleItem1765401986485 implements MigrationInterface {
    name = 'AddColumnInMicroCycleItem1765401986485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "micro_cycle_item" ADD "isSkipped" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "micro_cycle_item" DROP COLUMN "isSkipped"`);
    }

}
