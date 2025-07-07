import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1751923201314 implements MigrationInterface {
    name = 'InitialMigration1751923201314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "execution_set" DROP CONSTRAINT "FK_7e6bccc4261f99307faef9c488b"`);
        await queryRunner.query(`CREATE TYPE "public"."micro_cycle_volume_musclegroup_enum" AS ENUM('CHEST_TOTAL', 'CHEST_UPPER', 'CHEST_MIDDLE', 'CHEST_LOWER', 'BACK_TOTAL', 'BACK_UPPER', 'BACK_LOWER', 'BACK_LATS', 'BACK_RHOMBOIDS', 'LEGS_TOTAL', 'QUADRICEPS', 'QUADRICEPS_RECTUS_FEMORIS', 'QUADRICEPS_VASTUS_LATERALIS', 'QUADRICEPS_VASTUS_MEDIALIS', 'QUADRICEPS_VASTUS_INTERMEDIUS', 'HAMSTRINGS', 'HAMSTRINGS_BICEPS_FEMORIS', 'HAMSTRINGS_SEMITENDINOSUS', 'HAMSTRINGS_SEMIMEMBRANOSUS', 'CALVES', 'CALVES_GASTROCNEMIUS', 'CALVES_SOLEUS', 'GLUTES', 'SHOULDERS_TOTAL', 'SHOULDERS_FRONT_DELT', 'SHOULDERS_SIDE_DELT', 'SHOULDERS_REAR_DELT', 'BICEPS_TOTAL', 'BICEPS_LONG_HEAD', 'BICEPS_SHORT_HEAD', 'BRACHIALIS', 'TRICEPS_TOTAL', 'TRICEPS_LONG_HEAD', 'TRICEPS_MEDIAL_HEAD', 'TRICEPS_LATERAL_HEAD', 'FOREARMS', 'ABS_TOTAL', 'ABS_UPPER', 'ABS_LOWER', 'ABS_OBLIQUES', 'TRAPS')`);
        await queryRunner.query(`CREATE TABLE "micro_cycle_volume" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "muscleGroup" "public"."micro_cycle_volume_musclegroup_enum" NOT NULL, "totalVolume" integer NOT NULL, "microCycleId" uuid, CONSTRAINT "PK_7ea2160b406b92e82d7e201986e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "micro_cycle" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startDate" date NOT NULL, "endDate" date NOT NULL, "macroCycleId" uuid, CONSTRAINT "PK_25c7af34d0124ba6d331695e028" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."macro_cycle_volume_musclegroup_enum" AS ENUM('CHEST_TOTAL', 'CHEST_UPPER', 'CHEST_MIDDLE', 'CHEST_LOWER', 'BACK_TOTAL', 'BACK_UPPER', 'BACK_LOWER', 'BACK_LATS', 'BACK_RHOMBOIDS', 'LEGS_TOTAL', 'QUADRICEPS', 'QUADRICEPS_RECTUS_FEMORIS', 'QUADRICEPS_VASTUS_LATERALIS', 'QUADRICEPS_VASTUS_MEDIALIS', 'QUADRICEPS_VASTUS_INTERMEDIUS', 'HAMSTRINGS', 'HAMSTRINGS_BICEPS_FEMORIS', 'HAMSTRINGS_SEMITENDINOSUS', 'HAMSTRINGS_SEMIMEMBRANOSUS', 'CALVES', 'CALVES_GASTROCNEMIUS', 'CALVES_SOLEUS', 'GLUTES', 'SHOULDERS_TOTAL', 'SHOULDERS_FRONT_DELT', 'SHOULDERS_SIDE_DELT', 'SHOULDERS_REAR_DELT', 'BICEPS_TOTAL', 'BICEPS_LONG_HEAD', 'BICEPS_SHORT_HEAD', 'BRACHIALIS', 'TRICEPS_TOTAL', 'TRICEPS_LONG_HEAD', 'TRICEPS_MEDIAL_HEAD', 'TRICEPS_LATERAL_HEAD', 'FOREARMS', 'ABS_TOTAL', 'ABS_UPPER', 'ABS_LOWER', 'ABS_OBLIQUES', 'TRAPS')`);
        await queryRunner.query(`CREATE TYPE "public"."macro_cycle_volume_recommendation_enum" AS ENUM('up', 'same', 'down')`);
        await queryRunner.query(`CREATE TABLE "macro_cycle_volume" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "muscleGroup" "public"."macro_cycle_volume_musclegroup_enum" NOT NULL, "totalVolume" integer NOT NULL, "changePct" integer NOT NULL, "recommendation" "public"."macro_cycle_volume_recommendation_enum" NOT NULL, "macroCycleId" uuid, CONSTRAINT "PK_06a8d335337fda85b349b39deee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "macro_cycle" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startDate" date NOT NULL, "endDate" date NOT NULL, "userId" uuid, CONSTRAINT "PK_c5e75e4306eca0738c2319ec4b5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(50) NOT NULL, "name" character varying(50) NOT NULL, "password" character varying(125) NOT NULL, "admin" boolean NOT NULL DEFAULT false, "createdAt" date NOT NULL DEFAULT now(), "updatedAt" date NOT NULL DEFAULT now(), "deletedAt" date, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "workout" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "userId" uuid, CONSTRAINT "PK_ea37ec052825688082b19f0d939" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "execution" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "workoutId" uuid, "microCycleId" uuid, CONSTRAINT "PK_cc6684fedf29ec4c86db8448a2b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "execution_set" DROP CONSTRAINT "PK_0e8f131353e27f84b017aac231f"`);
        await queryRunner.query(`ALTER TABLE "execution_set" DROP COLUMN "setExecID"`);
        await queryRunner.query(`ALTER TABLE "execution_set" DROP COLUMN "executionID"`);
        await queryRunner.query(`ALTER TABLE "execution_set" DROP COLUMN "setNumber"`);
        await queryRunner.query(`ALTER TABLE "execution_set" DROP COLUMN "completedAt"`);
        await queryRunner.query(`ALTER TABLE "execution_set" DROP COLUMN "previousWeight"`);
        await queryRunner.query(`ALTER TABLE "execution_set" DROP COLUMN "previousReps"`);
        await queryRunner.query(`ALTER TABLE "execution_set" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "execution_set" ADD CONSTRAINT "PK_fcb4a259c87f34d04ee5012e812" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "execution_set" ADD "exerciseName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "execution_set" ADD "muscleGroup" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "execution_set" ADD "executionId" uuid`);
        await queryRunner.query(`ALTER TABLE "execution_set" ALTER COLUMN "reps" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "execution_set" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "execution_set" ADD "weight" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "micro_cycle_volume" ADD CONSTRAINT "FK_a93d3dd63767b67e9427cc64612" FOREIGN KEY ("microCycleId") REFERENCES "micro_cycle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "micro_cycle" ADD CONSTRAINT "FK_93bfe27710a8663734b1740b679" FOREIGN KEY ("macroCycleId") REFERENCES "macro_cycle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "macro_cycle_volume" ADD CONSTRAINT "FK_d5bb7ce3b595e5c4be74a2b285d" FOREIGN KEY ("macroCycleId") REFERENCES "macro_cycle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "macro_cycle" ADD CONSTRAINT "FK_8a71eacd0731ee9d5f9418332ab" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workout" ADD CONSTRAINT "FK_5c6e4714ac75eab49d2009f956c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "execution" ADD CONSTRAINT "FK_560330cdc12e3ad24fa8ceba2e1" FOREIGN KEY ("workoutId") REFERENCES "workout"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "execution" ADD CONSTRAINT "FK_d25bbf76699c376710d8370c3c0" FOREIGN KEY ("microCycleId") REFERENCES "micro_cycle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "execution_set" ADD CONSTRAINT "FK_61d05d9f3c13255e21733559865" FOREIGN KEY ("executionId") REFERENCES "execution"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "execution_set" DROP CONSTRAINT "FK_61d05d9f3c13255e21733559865"`);
        await queryRunner.query(`ALTER TABLE "execution" DROP CONSTRAINT "FK_d25bbf76699c376710d8370c3c0"`);
        await queryRunner.query(`ALTER TABLE "execution" DROP CONSTRAINT "FK_560330cdc12e3ad24fa8ceba2e1"`);
        await queryRunner.query(`ALTER TABLE "workout" DROP CONSTRAINT "FK_5c6e4714ac75eab49d2009f956c"`);
        await queryRunner.query(`ALTER TABLE "macro_cycle" DROP CONSTRAINT "FK_8a71eacd0731ee9d5f9418332ab"`);
        await queryRunner.query(`ALTER TABLE "macro_cycle_volume" DROP CONSTRAINT "FK_d5bb7ce3b595e5c4be74a2b285d"`);
        await queryRunner.query(`ALTER TABLE "micro_cycle" DROP CONSTRAINT "FK_93bfe27710a8663734b1740b679"`);
        await queryRunner.query(`ALTER TABLE "micro_cycle_volume" DROP CONSTRAINT "FK_a93d3dd63767b67e9427cc64612"`);
        await queryRunner.query(`ALTER TABLE "execution_set" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "execution_set" ADD "weight" numeric`);
        await queryRunner.query(`ALTER TABLE "execution_set" ALTER COLUMN "reps" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "execution_set" DROP COLUMN "executionId"`);
        await queryRunner.query(`ALTER TABLE "execution_set" DROP COLUMN "muscleGroup"`);
        await queryRunner.query(`ALTER TABLE "execution_set" DROP COLUMN "exerciseName"`);
        await queryRunner.query(`ALTER TABLE "execution_set" DROP CONSTRAINT "PK_fcb4a259c87f34d04ee5012e812"`);
        await queryRunner.query(`ALTER TABLE "execution_set" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "execution_set" ADD "previousReps" integer`);
        await queryRunner.query(`ALTER TABLE "execution_set" ADD "previousWeight" numeric`);
        await queryRunner.query(`ALTER TABLE "execution_set" ADD "completedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "execution_set" ADD "setNumber" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "execution_set" ADD "executionID" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "execution_set" ADD "setExecID" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "execution_set" ADD CONSTRAINT "PK_0e8f131353e27f84b017aac231f" PRIMARY KEY ("setExecID")`);
        await queryRunner.query(`DROP TABLE "execution"`);
        await queryRunner.query(`DROP TABLE "workout"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "macro_cycle"`);
        await queryRunner.query(`DROP TABLE "macro_cycle_volume"`);
        await queryRunner.query(`DROP TYPE "public"."macro_cycle_volume_recommendation_enum"`);
        await queryRunner.query(`DROP TYPE "public"."macro_cycle_volume_musclegroup_enum"`);
        await queryRunner.query(`DROP TABLE "micro_cycle"`);
        await queryRunner.query(`DROP TABLE "micro_cycle_volume"`);
        await queryRunner.query(`DROP TYPE "public"."micro_cycle_volume_musclegroup_enum"`);
        await queryRunner.query(`ALTER TABLE "execution_set" ADD CONSTRAINT "FK_7e6bccc4261f99307faef9c488b" FOREIGN KEY ("executionID") REFERENCES "exercise_execution"("executionID") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
