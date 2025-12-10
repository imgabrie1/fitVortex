import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorMacroMicroRelations1765339250798 implements MigrationInterface {
    name = 'RefactorMacroMicroRelations1765339250798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "micro_cycle" ADD "macroCycleId" uuid`);
        await queryRunner.query(`ALTER TABLE "micro_cycle" ADD CONSTRAINT "FK_93bfe27710a8663734b1740b679" FOREIGN KEY ("macroCycleId") REFERENCES "macro_cycle"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "micro_cycle" DROP CONSTRAINT "FK_93bfe27710a8663734b1740b679"`);
        await queryRunner.query(`ALTER TABLE "micro_cycle" DROP COLUMN "macroCycleId"`);
    }

}
