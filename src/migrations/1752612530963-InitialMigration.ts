import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1752612530963 implements MigrationInterface {
    name = 'InitialMigration1752612530963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(50) NOT NULL, "name" character varying(50) NOT NULL, "password" character varying(125) NOT NULL, "admin" boolean NOT NULL DEFAULT false, "createdAt" date NOT NULL DEFAULT now(), "updatedAt" date NOT NULL DEFAULT now(), "deletedAt" date, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."macro_cycle_volume_musclegroup_enum" AS ENUM('Peito (Total)', 'Peito Superior', 'Peito Médio', 'Peito Inferior', 'Costas (Total)', 'Costas Superior', 'Costas Inferior', 'Dorsais (Latíssimo do Dorso)', 'Rombóides', 'Pernas (Total)', 'Quadríceps (Total)', 'Reto Femoral', 'Vasto Lateral', 'Vasto Medial', 'Vasto Intermédio', 'Posterior de Coxa (Total)', 'Bíceps Femoral', 'Semitendíneo', 'Semimembranoso', 'Panturrilhas (Total)', 'Gastrocnêmio', 'Sóleo', 'Glúteos', 'Ombros (Total)', 'Deltóide Anterior', 'Deltóide Lateral', 'Deltóide Posterior', 'Bíceps (Total)', 'Cabeça Longa do Bíceps', 'Cabeça Curta do Bíceps', 'Braquial', 'Tríceps (Total)', 'Cabeça Longa do Tríceps', 'Cabeça Medial do Tríceps', 'Cabeça Lateral do Tríceps', 'Antebraços', 'Abdominais (Total)', 'Abdominais Superiores', 'Abdominais Inferiores', 'Oblíquos', 'Trapézios')`);
        await queryRunner.query(`CREATE TYPE "public"."macro_cycle_volume_recommendation_enum" AS ENUM('up', 'same', 'down')`);
        await queryRunner.query(`CREATE TABLE "macro_cycle_volume" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "muscleGroup" "public"."macro_cycle_volume_musclegroup_enum" NOT NULL, "totalVolume" integer NOT NULL, "changePct" integer NOT NULL, "recommendation" "public"."macro_cycle_volume_recommendation_enum" NOT NULL, "macroCycleId" uuid, CONSTRAINT "PK_06a8d335337fda85b349b39deee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "macro_cycle" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startDate" date NOT NULL, "endDate" date NOT NULL, "microQuantity" integer NOT NULL, "userId" uuid, CONSTRAINT "PK_c5e75e4306eca0738c2319ec4b5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."micro_cycle_volume_musclegroup_enum" AS ENUM('Peito (Total)', 'Peito Superior', 'Peito Médio', 'Peito Inferior', 'Costas (Total)', 'Costas Superior', 'Costas Inferior', 'Dorsais (Latíssimo do Dorso)', 'Rombóides', 'Pernas (Total)', 'Quadríceps (Total)', 'Reto Femoral', 'Vasto Lateral', 'Vasto Medial', 'Vasto Intermédio', 'Posterior de Coxa (Total)', 'Bíceps Femoral', 'Semitendíneo', 'Semimembranoso', 'Panturrilhas (Total)', 'Gastrocnêmio', 'Sóleo', 'Glúteos', 'Ombros (Total)', 'Deltóide Anterior', 'Deltóide Lateral', 'Deltóide Posterior', 'Bíceps (Total)', 'Cabeça Longa do Bíceps', 'Cabeça Curta do Bíceps', 'Braquial', 'Tríceps (Total)', 'Cabeça Longa do Tríceps', 'Cabeça Medial do Tríceps', 'Cabeça Lateral do Tríceps', 'Antebraços', 'Abdominais (Total)', 'Abdominais Superiores', 'Abdominais Inferiores', 'Oblíquos', 'Trapézios')`);
        await queryRunner.query(`CREATE TABLE "micro_cycle_volume" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "muscleGroup" "public"."micro_cycle_volume_musclegroup_enum" NOT NULL, "totalVolume" integer NOT NULL, "microCycleId" uuid, CONSTRAINT "PK_7ea2160b406b92e82d7e201986e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "micro_cycle" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "macroCycleId" uuid, "createdAt" date NOT NULL DEFAULT now(), "trainingDays" integer NOT NULL DEFAULT '1', "userId" uuid NOT NULL, CONSTRAINT "PK_25c7af34d0124ba6d331695e028" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."exercise_primarymuscle_enum" AS ENUM('Peito (Total)', 'Peito Superior', 'Peito Médio', 'Peito Inferior', 'Costas (Total)', 'Costas Superior', 'Costas Inferior', 'Dorsais (Latíssimo do Dorso)', 'Rombóides', 'Pernas (Total)', 'Quadríceps (Total)', 'Reto Femoral', 'Vasto Lateral', 'Vasto Medial', 'Vasto Intermédio', 'Posterior de Coxa (Total)', 'Bíceps Femoral', 'Semitendíneo', 'Semimembranoso', 'Panturrilhas (Total)', 'Gastrocnêmio', 'Sóleo', 'Glúteos', 'Ombros (Total)', 'Deltóide Anterior', 'Deltóide Lateral', 'Deltóide Posterior', 'Bíceps (Total)', 'Cabeça Longa do Bíceps', 'Cabeça Curta do Bíceps', 'Braquial', 'Tríceps (Total)', 'Cabeça Longa do Tríceps', 'Cabeça Medial do Tríceps', 'Cabeça Lateral do Tríceps', 'Antebraços', 'Abdominais (Total)', 'Abdominais Superiores', 'Abdominais Inferiores', 'Oblíquos', 'Trapézios')`);
        await queryRunner.query(`CREATE TYPE "public"."exercise_secondarymuscle_enum" AS ENUM('Peito (Total)', 'Peito Superior', 'Peito Médio', 'Peito Inferior', 'Costas (Total)', 'Costas Superior', 'Costas Inferior', 'Dorsais (Latíssimo do Dorso)', 'Rombóides', 'Pernas (Total)', 'Quadríceps (Total)', 'Reto Femoral', 'Vasto Lateral', 'Vasto Medial', 'Vasto Intermédio', 'Posterior de Coxa (Total)', 'Bíceps Femoral', 'Semitendíneo', 'Semimembranoso', 'Panturrilhas (Total)', 'Gastrocnêmio', 'Sóleo', 'Glúteos', 'Ombros (Total)', 'Deltóide Anterior', 'Deltóide Lateral', 'Deltóide Posterior', 'Bíceps (Total)', 'Cabeça Longa do Bíceps', 'Cabeça Curta do Bíceps', 'Braquial', 'Tríceps (Total)', 'Cabeça Longa do Tríceps', 'Cabeça Medial do Tríceps', 'Cabeça Lateral do Tríceps', 'Antebraços', 'Abdominais (Total)', 'Abdominais Superiores', 'Abdominais Inferiores', 'Oblíquos', 'Trapézios')`);
        await queryRunner.query(`CREATE TABLE "exercise" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "description" character varying, "primaryMuscle" "public"."exercise_primarymuscle_enum" NOT NULL, "secondaryMuscle" "public"."exercise_secondarymuscle_enum", CONSTRAINT "PK_a0f107e3a2ef2742c1e91d97c14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "workout" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "microCycleId" uuid, CONSTRAINT "PK_ea37ec052825688082b19f0d939" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "workout_exercises_exercise" ("workoutId" uuid NOT NULL, "exerciseId" uuid NOT NULL, CONSTRAINT "PK_a2070ea377aa75a013711d1558f" PRIMARY KEY ("workoutId", "exerciseId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ebbf4b6ada07370d4fd4cacc27" ON "workout_exercises_exercise" ("workoutId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0bb8852de78dba0857f37cae56" ON "workout_exercises_exercise" ("exerciseId") `);
        await queryRunner.query(`ALTER TABLE "macro_cycle_volume" ADD CONSTRAINT "FK_d5bb7ce3b595e5c4be74a2b285d" FOREIGN KEY ("macroCycleId") REFERENCES "macro_cycle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "macro_cycle" ADD CONSTRAINT "FK_8a71eacd0731ee9d5f9418332ab" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "micro_cycle_volume" ADD CONSTRAINT "FK_a93d3dd63767b67e9427cc64612" FOREIGN KEY ("microCycleId") REFERENCES "micro_cycle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "micro_cycle" ADD CONSTRAINT "FK_93bfe27710a8663734b1740b679" FOREIGN KEY ("macroCycleId") REFERENCES "macro_cycle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "micro_cycle" ADD CONSTRAINT "FK_c67972fa530d26c3eb1c7bc587b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workout" ADD CONSTRAINT "FK_53d9dadfc5e7cc661f8b538888d" FOREIGN KEY ("microCycleId") REFERENCES "micro_cycle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workout_exercises_exercise" ADD CONSTRAINT "FK_ebbf4b6ada07370d4fd4cacc27d" FOREIGN KEY ("workoutId") REFERENCES "workout"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "workout_exercises_exercise" ADD CONSTRAINT "FK_0bb8852de78dba0857f37cae564" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workout_exercises_exercise" DROP CONSTRAINT "FK_0bb8852de78dba0857f37cae564"`);
        await queryRunner.query(`ALTER TABLE "workout_exercises_exercise" DROP CONSTRAINT "FK_ebbf4b6ada07370d4fd4cacc27d"`);
        await queryRunner.query(`ALTER TABLE "workout" DROP CONSTRAINT "FK_53d9dadfc5e7cc661f8b538888d"`);
        await queryRunner.query(`ALTER TABLE "micro_cycle" DROP CONSTRAINT "FK_c67972fa530d26c3eb1c7bc587b"`);
        await queryRunner.query(`ALTER TABLE "micro_cycle" DROP CONSTRAINT "FK_93bfe27710a8663734b1740b679"`);
        await queryRunner.query(`ALTER TABLE "micro_cycle_volume" DROP CONSTRAINT "FK_a93d3dd63767b67e9427cc64612"`);
        await queryRunner.query(`ALTER TABLE "macro_cycle" DROP CONSTRAINT "FK_8a71eacd0731ee9d5f9418332ab"`);
        await queryRunner.query(`ALTER TABLE "macro_cycle_volume" DROP CONSTRAINT "FK_d5bb7ce3b595e5c4be74a2b285d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0bb8852de78dba0857f37cae56"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ebbf4b6ada07370d4fd4cacc27"`);
        await queryRunner.query(`DROP TABLE "workout_exercises_exercise"`);
        await queryRunner.query(`DROP TABLE "workout"`);
        await queryRunner.query(`DROP TABLE "exercise"`);
        await queryRunner.query(`DROP TYPE "public"."exercise_secondarymuscle_enum"`);
        await queryRunner.query(`DROP TYPE "public"."exercise_primarymuscle_enum"`);
        await queryRunner.query(`DROP TABLE "micro_cycle"`);
        await queryRunner.query(`DROP TABLE "micro_cycle_volume"`);
        await queryRunner.query(`DROP TYPE "public"."micro_cycle_volume_musclegroup_enum"`);
        await queryRunner.query(`DROP TABLE "macro_cycle"`);
        await queryRunner.query(`DROP TABLE "macro_cycle_volume"`);
        await queryRunner.query(`DROP TYPE "public"."macro_cycle_volume_recommendation_enum"`);
        await queryRunner.query(`DROP TYPE "public"."macro_cycle_volume_musclegroup_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
