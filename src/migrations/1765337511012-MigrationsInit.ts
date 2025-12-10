import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationsInit1765337511012 implements MigrationInterface {
    name = 'MigrationsInit1765337511012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "macro_cycle_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "macroCycleId" uuid, "microCycleId" uuid, CONSTRAINT "PK_e03ff97bf31d5b71bb07b04667d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."macro_cycle_volume_musclegroup_enum" AS ENUM('Peito (Total)', 'Peito Superior', 'Peito Médio', 'Peito Inferior', 'Costas (Total)', 'Costas Superior', 'Costas Inferior', 'Dorsais (Latíssimo do Dorso)', 'Rombóides', 'Pernas (Total)', 'Quadríceps (Total)', 'Reto Femoral', 'Vasto Lateral', 'Vasto Medial', 'Vasto Intermédio', 'Posterior de Coxa (Total)', 'Bíceps Femoral', 'Semitendíneo', 'Semimembranoso', 'Panturrilhas (Total)', 'Gastrocnêmio', 'Sóleo', 'Glúteos', 'Ombros (Total)', 'Deltóide Anterior', 'Deltóide Lateral', 'Deltóide Posterior', 'Bíceps (Total)', 'Cabeça Longa do Bíceps', 'Cabeça Curta do Bíceps', 'Braquial', 'Tríceps (Total)', 'Cabeça Longa do Tríceps', 'Cabeça Medial do Tríceps', 'Cabeça Lateral do Tríceps', 'Antebraços', 'Abdominais (Total)', 'Abdominais Superiores', 'Abdominais Inferiores', 'Oblíquos', 'Trapézios')`);
        await queryRunner.query(`CREATE TYPE "public"."macro_cycle_volume_recommendation_enum" AS ENUM('up', 'down', 'same')`);
        await queryRunner.query(`CREATE TABLE "macro_cycle_volume" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "muscleGroup" "public"."macro_cycle_volume_musclegroup_enum" NOT NULL, "totalVolume" integer NOT NULL, "changePct" integer NOT NULL, "recommendation" "public"."macro_cycle_volume_recommendation_enum" NOT NULL, "macroCycleId" uuid, CONSTRAINT "PK_06a8d335337fda85b349b39deee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "macro_cycle" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "macroCycleName" character varying(50) NOT NULL, "startDate" date NOT NULL, "endDate" date NOT NULL, "microQuantity" integer NOT NULL, "userId" uuid, CONSTRAINT "PK_c5e75e4306eca0738c2319ec4b5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(50) NOT NULL, "name" character varying(50) NOT NULL, "password" character varying(125) NOT NULL, "admin" boolean NOT NULL DEFAULT false, "createdAt" date NOT NULL DEFAULT now(), "updatedAt" date NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."micro_cycle_volume_musclegroup_enum" AS ENUM('Peito (Total)', 'Peito Superior', 'Peito Médio', 'Peito Inferior', 'Costas (Total)', 'Costas Superior', 'Costas Inferior', 'Dorsais (Latíssimo do Dorso)', 'Rombóides', 'Pernas (Total)', 'Quadríceps (Total)', 'Reto Femoral', 'Vasto Lateral', 'Vasto Medial', 'Vasto Intermédio', 'Posterior de Coxa (Total)', 'Bíceps Femoral', 'Semitendíneo', 'Semimembranoso', 'Panturrilhas (Total)', 'Gastrocnêmio', 'Sóleo', 'Glúteos', 'Ombros (Total)', 'Deltóide Anterior', 'Deltóide Lateral', 'Deltóide Posterior', 'Bíceps (Total)', 'Cabeça Longa do Bíceps', 'Cabeça Curta do Bíceps', 'Braquial', 'Tríceps (Total)', 'Cabeça Longa do Tríceps', 'Cabeça Medial do Tríceps', 'Cabeça Lateral do Tríceps', 'Antebraços', 'Abdominais (Total)', 'Abdominais Superiores', 'Abdominais Inferiores', 'Oblíquos', 'Trapézios')`);
        await queryRunner.query(`CREATE TABLE "micro_cycle_volume" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "muscleGroup" "public"."micro_cycle_volume_musclegroup_enum" NOT NULL, "totalVolume" double precision NOT NULL, "microCycleId" uuid, CONSTRAINT "PK_7ea2160b406b92e82d7e201986e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "micro_cycle" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "microCycleName" character varying NOT NULL, "createdAt" date NOT NULL DEFAULT now(), "trainingDays" integer NOT NULL DEFAULT '1', "userID" uuid NOT NULL, CONSTRAINT "PK_25c7af34d0124ba6d331695e028" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "workout_exercises" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "targetSets" integer NOT NULL, "is_unilateral" boolean NOT NULL DEFAULT false, "position" integer NOT NULL, "workoutId" uuid, "exerciseId" uuid, CONSTRAINT "PK_377f9ead6fd69b29f0d0feb1028" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."exercise_resistancetype_enum" AS ENUM('Peso corporal', 'Peso livre', 'Máquina com anilhas', 'Máquina com polias', 'elástico', 'other')`);
        await queryRunner.query(`CREATE TYPE "public"."exercise_primarymuscle_enum" AS ENUM('Peito (Total)', 'Peito Superior', 'Peito Médio', 'Peito Inferior', 'Costas (Total)', 'Costas Superior', 'Costas Inferior', 'Dorsais (Latíssimo do Dorso)', 'Rombóides', 'Pernas (Total)', 'Quadríceps (Total)', 'Reto Femoral', 'Vasto Lateral', 'Vasto Medial', 'Vasto Intermédio', 'Posterior de Coxa (Total)', 'Bíceps Femoral', 'Semitendíneo', 'Semimembranoso', 'Panturrilhas (Total)', 'Gastrocnêmio', 'Sóleo', 'Glúteos', 'Ombros (Total)', 'Deltóide Anterior', 'Deltóide Lateral', 'Deltóide Posterior', 'Bíceps (Total)', 'Cabeça Longa do Bíceps', 'Cabeça Curta do Bíceps', 'Braquial', 'Tríceps (Total)', 'Cabeça Longa do Tríceps', 'Cabeça Medial do Tríceps', 'Cabeça Lateral do Tríceps', 'Antebraços', 'Abdominais (Total)', 'Abdominais Superiores', 'Abdominais Inferiores', 'Oblíquos', 'Trapézios')`);
        await queryRunner.query(`CREATE TABLE "exercise" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "imageURL" character varying, "description" character varying, "resistanceType" "public"."exercise_resistancetype_enum" NOT NULL, "primaryMuscle" "public"."exercise_primarymuscle_enum" NOT NULL, "secondaryMuscle" jsonb DEFAULT '[]', "default_unilateral" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_a0f107e3a2ef2742c1e91d97c14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."sets_side_enum" AS ENUM('left', 'right', 'both')`);
        await queryRunner.query(`CREATE TABLE "sets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reps" integer NOT NULL, "weight" numeric(5,2) NOT NULL, "notes" character varying(255), "side" "public"."sets_side_enum" NOT NULL DEFAULT 'both', "microCycleItemId" uuid, "exerciseId" uuid, CONSTRAINT "PK_5d15ed8b3e2a5cb6e9c9921d056" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "micro_cycle_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "position" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "microCycleId" uuid, "workoutId" uuid, CONSTRAINT "PK_69fc88977e6c0fcf036e0741c1b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "workout" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "volumeId" uuid, CONSTRAINT "REL_e5cb19199eb45a66180c1ec2b2" UNIQUE ("volumeId"), CONSTRAINT "PK_ea37ec052825688082b19f0d939" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "workout_volumes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_658bade8789bcf04c035f043f36" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."workout_volume_entries_musclegroup_enum" AS ENUM('Peito (Total)', 'Peito Superior', 'Peito Médio', 'Peito Inferior', 'Costas (Total)', 'Costas Superior', 'Costas Inferior', 'Dorsais (Latíssimo do Dorso)', 'Rombóides', 'Pernas (Total)', 'Quadríceps (Total)', 'Reto Femoral', 'Vasto Lateral', 'Vasto Medial', 'Vasto Intermédio', 'Posterior de Coxa (Total)', 'Bíceps Femoral', 'Semitendíneo', 'Semimembranoso', 'Panturrilhas (Total)', 'Gastrocnêmio', 'Sóleo', 'Glúteos', 'Ombros (Total)', 'Deltóide Anterior', 'Deltóide Lateral', 'Deltóide Posterior', 'Bíceps (Total)', 'Cabeça Longa do Bíceps', 'Cabeça Curta do Bíceps', 'Braquial', 'Tríceps (Total)', 'Cabeça Longa do Tríceps', 'Cabeça Medial do Tríceps', 'Cabeça Lateral do Tríceps', 'Antebraços', 'Abdominais (Total)', 'Abdominais Superiores', 'Abdominais Inferiores', 'Oblíquos', 'Trapézios')`);
        await queryRunner.query(`CREATE TABLE "workout_volume_entries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "muscleGroup" "public"."workout_volume_entries_musclegroup_enum" NOT NULL, "volume" double precision NOT NULL DEFAULT '0', "sets" integer NOT NULL DEFAULT '0', "workoutVolumeId" uuid, CONSTRAINT "UQ_dea4a815e0000fcaad9e7c5430d" UNIQUE ("workoutVolumeId", "muscleGroup"), CONSTRAINT "PK_f16200e31414a7c1064829a78f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "macro_cycle_item" ADD CONSTRAINT "FK_9020235adb9543ae0c714f016e0" FOREIGN KEY ("macroCycleId") REFERENCES "macro_cycle"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "macro_cycle_item" ADD CONSTRAINT "FK_ba09bb37e11ecd83f53d58bbb26" FOREIGN KEY ("microCycleId") REFERENCES "micro_cycle"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "macro_cycle_volume" ADD CONSTRAINT "FK_d5bb7ce3b595e5c4be74a2b285d" FOREIGN KEY ("macroCycleId") REFERENCES "macro_cycle"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "macro_cycle" ADD CONSTRAINT "FK_8a71eacd0731ee9d5f9418332ab" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "micro_cycle_volume" ADD CONSTRAINT "FK_a93d3dd63767b67e9427cc64612" FOREIGN KEY ("microCycleId") REFERENCES "micro_cycle"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "micro_cycle" ADD CONSTRAINT "FK_ca40d2987f6b628c7aaf5bc6ca6" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workout_exercises" ADD CONSTRAINT "FK_d616bcfffe0b6bb322281ae3754" FOREIGN KEY ("workoutId") REFERENCES "workout"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workout_exercises" ADD CONSTRAINT "FK_1222e38fcd49c77d6ae78c6b073" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sets" ADD CONSTRAINT "FK_764d0ec5fee5e7bddcf69b1f9f5" FOREIGN KEY ("microCycleItemId") REFERENCES "micro_cycle_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sets" ADD CONSTRAINT "FK_cca58e1bb2859ccf722d4633a1b" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "micro_cycle_item" ADD CONSTRAINT "FK_75df0a62600dcbbeea6409ac1e6" FOREIGN KEY ("microCycleId") REFERENCES "micro_cycle"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "micro_cycle_item" ADD CONSTRAINT "FK_3b348dc3746e9ef25e46294c262" FOREIGN KEY ("workoutId") REFERENCES "workout"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workout" ADD CONSTRAINT "FK_e5cb19199eb45a66180c1ec2b26" FOREIGN KEY ("volumeId") REFERENCES "workout_volumes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workout_volume_entries" ADD CONSTRAINT "FK_99b8a6cdddf4633b6fd74149e0c" FOREIGN KEY ("workoutVolumeId") REFERENCES "workout_volumes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workout_volume_entries" DROP CONSTRAINT "FK_99b8a6cdddf4633b6fd74149e0c"`);
        await queryRunner.query(`ALTER TABLE "workout" DROP CONSTRAINT "FK_e5cb19199eb45a66180c1ec2b26"`);
        await queryRunner.query(`ALTER TABLE "micro_cycle_item" DROP CONSTRAINT "FK_3b348dc3746e9ef25e46294c262"`);
        await queryRunner.query(`ALTER TABLE "micro_cycle_item" DROP CONSTRAINT "FK_75df0a62600dcbbeea6409ac1e6"`);
        await queryRunner.query(`ALTER TABLE "sets" DROP CONSTRAINT "FK_cca58e1bb2859ccf722d4633a1b"`);
        await queryRunner.query(`ALTER TABLE "sets" DROP CONSTRAINT "FK_764d0ec5fee5e7bddcf69b1f9f5"`);
        await queryRunner.query(`ALTER TABLE "workout_exercises" DROP CONSTRAINT "FK_1222e38fcd49c77d6ae78c6b073"`);
        await queryRunner.query(`ALTER TABLE "workout_exercises" DROP CONSTRAINT "FK_d616bcfffe0b6bb322281ae3754"`);
        await queryRunner.query(`ALTER TABLE "micro_cycle" DROP CONSTRAINT "FK_ca40d2987f6b628c7aaf5bc6ca6"`);
        await queryRunner.query(`ALTER TABLE "micro_cycle_volume" DROP CONSTRAINT "FK_a93d3dd63767b67e9427cc64612"`);
        await queryRunner.query(`ALTER TABLE "macro_cycle" DROP CONSTRAINT "FK_8a71eacd0731ee9d5f9418332ab"`);
        await queryRunner.query(`ALTER TABLE "macro_cycle_volume" DROP CONSTRAINT "FK_d5bb7ce3b595e5c4be74a2b285d"`);
        await queryRunner.query(`ALTER TABLE "macro_cycle_item" DROP CONSTRAINT "FK_ba09bb37e11ecd83f53d58bbb26"`);
        await queryRunner.query(`ALTER TABLE "macro_cycle_item" DROP CONSTRAINT "FK_9020235adb9543ae0c714f016e0"`);
        await queryRunner.query(`DROP TABLE "workout_volume_entries"`);
        await queryRunner.query(`DROP TYPE "public"."workout_volume_entries_musclegroup_enum"`);
        await queryRunner.query(`DROP TABLE "workout_volumes"`);
        await queryRunner.query(`DROP TABLE "workout"`);
        await queryRunner.query(`DROP TABLE "micro_cycle_item"`);
        await queryRunner.query(`DROP TABLE "sets"`);
        await queryRunner.query(`DROP TYPE "public"."sets_side_enum"`);
        await queryRunner.query(`DROP TABLE "exercise"`);
        await queryRunner.query(`DROP TYPE "public"."exercise_primarymuscle_enum"`);
        await queryRunner.query(`DROP TYPE "public"."exercise_resistancetype_enum"`);
        await queryRunner.query(`DROP TABLE "workout_exercises"`);
        await queryRunner.query(`DROP TABLE "micro_cycle"`);
        await queryRunner.query(`DROP TABLE "micro_cycle_volume"`);
        await queryRunner.query(`DROP TYPE "public"."micro_cycle_volume_musclegroup_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "macro_cycle"`);
        await queryRunner.query(`DROP TABLE "macro_cycle_volume"`);
        await queryRunner.query(`DROP TYPE "public"."macro_cycle_volume_recommendation_enum"`);
        await queryRunner.query(`DROP TYPE "public"."macro_cycle_volume_musclegroup_enum"`);
        await queryRunner.query(`DROP TABLE "macro_cycle_item"`);
    }

}
