import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsUnilateralInWorkoutExercise1763592534122 implements MigrationInterface {
    name = 'AddIsUnilateralInWorkoutExercise1763592534122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workout_exercises" ALTER COLUMN "is_unilateral" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workout_exercises" ALTER COLUMN "is_unilateral" DROP DEFAULT`);
    }

}
