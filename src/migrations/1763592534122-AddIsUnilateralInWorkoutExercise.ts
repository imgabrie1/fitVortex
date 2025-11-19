import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsUnilateralInWorkoutExercise1763592534122
  implements MigrationInterface
{
  name = "AddIsUnilateralInWorkoutExercise1763592534122";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "workout_exercises"
            ADD COLUMN "is_unilateral" boolean NOT NULL DEFAULT false
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "workout_exercises"
            DROP COLUMN "is_unilateral"
        `);
  }
}
