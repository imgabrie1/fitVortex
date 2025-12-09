import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeDeleteToEntities1765241046732 implements MigrationInterface {
    name = 'AddCascadeDeleteToEntities1765241046732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "macro_cycle_item" DROP CONSTRAINT "FK_ba09bb37e11ecd83f53d58bbb26"`);
        await queryRunner.query(`ALTER TABLE "micro_cycle_item" DROP CONSTRAINT "FK_3b348dc3746e9ef25e46294c262"`);
        await queryRunner.query(`ALTER TABLE "macro_cycle_item" ADD CONSTRAINT "FK_ba09bb37e11ecd83f53d58bbb26" FOREIGN KEY ("microCycleId") REFERENCES "micro_cycle"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "micro_cycle_item" ADD CONSTRAINT "FK_3b348dc3746e9ef25e46294c262" FOREIGN KEY ("workoutId") REFERENCES "workout"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "micro_cycle_item" DROP CONSTRAINT "FK_3b348dc3746e9ef25e46294c262"`);
        await queryRunner.query(`ALTER TABLE "macro_cycle_item" DROP CONSTRAINT "FK_ba09bb37e11ecd83f53d58bbb26"`);
        await queryRunner.query(`ALTER TABLE "micro_cycle_item" ADD CONSTRAINT "FK_3b348dc3746e9ef25e46294c262" FOREIGN KEY ("workoutId") REFERENCES "workout"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "macro_cycle_item" ADD CONSTRAINT "FK_ba09bb37e11ecd83f53d58bbb26" FOREIGN KEY ("microCycleId") REFERENCES "micro_cycle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
