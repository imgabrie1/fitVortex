import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1752096249703 implements MigrationInterface {
    name = 'InitialMigration1752096249703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "micro_cycle" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "micro_cycle" DROP COLUMN "endDate"`);
        await queryRunner.query(`ALTER TABLE "micro_cycle" ADD "createdAt" date NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "micro_cycle" ADD "trainingDays" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "micro_cycle" DROP CONSTRAINT "FK_c67972fa530d26c3eb1c7bc587b"`);
        await queryRunner.query(`ALTER TABLE "micro_cycle" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "micro_cycle" ADD CONSTRAINT "FK_c67972fa530d26c3eb1c7bc587b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "micro_cycle" DROP CONSTRAINT "FK_c67972fa530d26c3eb1c7bc587b"`);
        await queryRunner.query(`ALTER TABLE "micro_cycle" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "micro_cycle" ADD CONSTRAINT "FK_c67972fa530d26c3eb1c7bc587b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "micro_cycle" DROP COLUMN "trainingDays"`);
        await queryRunner.query(`ALTER TABLE "micro_cycle" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "micro_cycle" ADD "endDate" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "micro_cycle" ADD "startDate" date NOT NULL`);
    }

}
