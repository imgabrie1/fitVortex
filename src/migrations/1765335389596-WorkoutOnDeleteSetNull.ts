import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkoutOnDeleteSetNull1765335389596 implements MigrationInterface {
    name = 'WorkoutOnDeleteSetNull1765335389596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "micro_cycle_item" DROP CONSTRAINT "FK_3b348dc3746e9ef25e46294c262"`);
        await queryRunner.query(`ALTER TABLE "micro_cycle_item" ADD CONSTRAINT "FK_3b348dc3746e9ef25e46294c262" FOREIGN KEY ("workoutId") REFERENCES "workout"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "micro_cycle_item" DROP CONSTRAINT "FK_3b348dc3746e9ef25e46294c262"`);
        await queryRunner.query(`ALTER TABLE "micro_cycle_item" ADD CONSTRAINT "FK_3b348dc3746e9ef25e46294c262" FOREIGN KEY ("workoutId") REFERENCES "workout"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
