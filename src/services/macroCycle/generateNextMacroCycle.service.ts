import { AppDataSource } from "../../data-source";
import { MacroCycle } from "../../entities/macroCycle.entity";
import { AppError } from "../../errors";
import { adjustVolumeService, VolumeAnalysis } from "./adjustVolume.service";
import { User } from "../../entities/user.entity";
import { MicroCycle } from "../../entities/microCycle.entity";
import { Workout } from "../../entities/workout.entity";
import { WorkoutExercise } from "../../entities/workoutExercise.entity";
import { Exercise } from "../../entities/exercise.entity";
import { MicroCycleItem } from "../../entities/microCycleItem.entity";
import { IMacroCycle } from "../../interfaces/macroCycle.interface";
import { formatDateToDDMMYYYY } from "../../utils/formatDate";

import {
  MuscleGroup,
  getMuscleGroupParents,
} from "../../enum/muscleGroup.enum";

const generateMacroCycleName = (ref?: any) => {
  if (ref?.macroCycleName) {
    const currentName = ref.macroCycleName;
    const match = currentName.match(/(.+?)\s+(\d+)$/);

    if (match) {
      const baseName = match[1];
      const nextNumber = parseInt(match[2], 10) + 1;
      return `${baseName} ${nextNumber}`;
    }

    return `${currentName} 2`;
  }
  return `Macrocycle ${new Date().toISOString().split("T")[0]}`;
};

const generateMicroCycleName = (refMicro?: any, idx = 1) => {
  if (refMicro?.microCycleName) {
    const baseName = refMicro.microCycleName.replace(/\s+\d+$/, "").trim();
    return `${baseName} ${idx}`;
  }
  return `Micro Ciclo #${idx}`;
};

interface IGenerateNextMacroCycle {
  macroCycleId: string;
  userId: string;
  modifications?: Array<{
    workoutName: string;
    action: "replace" | "remove" | "add";
    fromExercise?: string;
    toExercise?: string;
    targetSets?: number;
  }>;
  maxSetsPerMicroCycle?: number;
  // TODO: legPriority para funcionalidade futura para priorizar volume de pernas (Quadríceps ou Posterior)
  // legPriority?: "Quadríceps (Total)" | "Posterior de Coxa (Total)";
}

function clampSets(targetSets: number, isUnilateral: any): number {
  const isUni =
    isUnilateral === true || isUnilateral === "true" || isUnilateral === 1;

  if (isUni) {
    let clamped = Math.max(4, Math.min(targetSets, 8));
    if (clamped % 2 !== 0) {
      clamped = Math.round(clamped / 2) * 2;
    }
    return clamped;
  } else {
    return Math.max(2, Math.min(targetSets, 4));
  }
}

function applyManualModifications(
  workoutPlan: any[],
  modifications: IGenerateNextMacroCycle["modifications"],
  allExercises: Exercise[],
): any[] {
  if (!modifications || modifications.length === 0) {
    return workoutPlan;
  }

  const modifiedPlan = JSON.parse(JSON.stringify(workoutPlan));

  for (const mod of modifications) {
    const workout = modifiedPlan.find(
      (w: any) => w.name.toLowerCase() === mod.workoutName.toLowerCase(),
    );

    if (!workout) {
      console.warn(
        `Workout "${mod.workoutName}" não encontrado para modificação`,
      );
      continue;
    }

    switch (mod.action) {
      case "replace":
        if (!mod.fromExercise || !mod.toExercise) {
          console.warn(
            "Modificação 'replace' requer fromExercise e toExercise",
          );
          continue;
        }

        const fromExists = allExercises.some(
          (e) => e.name === mod.fromExercise,
        );
        const toExists = allExercises.some((e) => e.name === mod.toExercise);

        if (!fromExists) {
          console.warn(
            `Exercício "${mod.fromExercise}" não encontrado no banco`,
          );
          continue;
        }
        if (!toExists) {
          console.warn(`Exercício "${mod.toExercise}" não encontrado no banco`);
          continue;
        }

        const exerciseIndex = workout.exercises.findIndex(
          (e: any) => e.exerciseName === mod.fromExercise,
        );

        if (exerciseIndex !== -1) {
          const oldExercise = workout.exercises[exerciseIndex];
          const newDbExercise = allExercises.find(
            (e) => e.name === mod.toExercise,
          )!;
          oldExercise.exerciseName = mod.toExercise;
          oldExercise.isUnilateral = newDbExercise.default_unilateral;
          oldExercise.primaryMuscle = newDbExercise.primaryMuscle;
          oldExercise.secondaryMuscle = newDbExercise.secondaryMuscle;
          oldExercise.targetSets = clampSets(
            oldExercise.targetSets,
            oldExercise.isUnilateral,
          );
        } else {
          console.warn(
            `Exercício "${mod.fromExercise}" não encontrado no workout "${mod.workoutName}"`,
          );
        }
        break;

      case "remove":
        if (!mod.fromExercise) {
          console.warn("Modificação 'remove' requer fromExercise");
          continue;
        }

        const removeIndex = workout.exercises.findIndex(
          (e: any) => e.exerciseName === mod.fromExercise,
        );

        if (removeIndex !== -1) {
          console.log(
            `Removendo "${mod.fromExercise}" do workout "${mod.workoutName}"`,
          );
          workout.exercises.splice(removeIndex, 1);
        } else {
          console.warn(
            `Exercício "${mod.fromExercise}" não encontrado no workout "${mod.workoutName}"`,
          );
        }
        break;

      case "add":
        if (!mod.toExercise) {
          console.warn("Modificação 'add' requer toExercise");
          continue;
        }

        const addExists = allExercises.some((e) => e.name === mod.toExercise);
        if (!addExists) {
          console.warn(`Exercício "${mod.toExercise}" não encontrado no banco`);
          continue;
        }

        const alreadyExists = workout.exercises.some(
          (e: any) => e.exerciseName === mod.toExercise,
        );

        if (!alreadyExists) {
          console.log(
            `Adicionando "${mod.toExercise}" ao workout "${mod.workoutName}"`,
          );
          const defaultSets = 3;
          const userSpecifiedSets = mod.targetSets || defaultSets;
          const dbExercise = allExercises.find(
            (e) => e.name === mod.toExercise,
          )!;
          const isUnilateral = dbExercise.default_unilateral || false;

          const clampedSets = clampSets(userSpecifiedSets, isUnilateral);

          workout.exercises.push({
            exerciseName: mod.toExercise,
            targetSets: clampedSets,
            isUnilateral,
            primaryMuscle: dbExercise.primaryMuscle,
            secondaryMuscle: dbExercise.secondaryMuscle,
          });
        } else {
          console.warn(
            `Exercício "${mod.toExercise}" já existe no workout "${mod.workoutName}"`,
          );
        }
        break;
    }
  }

  return modifiedPlan;
}

function createSetsCounter() {
  const setsCount: { [key: string]: number } = {};
  Object.values(MuscleGroup).forEach((m) => (setsCount[m] = 0));

  const addSets = (
    muscle: MuscleGroup,
    sets: number,
    isUnilateral: any,
    multiplier: number,
  ) => {
    const isUni =
      isUnilateral === true || isUnilateral === "true" || isUnilateral === 1;
    const effectiveSets = (isUni ? sets / 2 : sets) * multiplier;
    setsCount[muscle] = (setsCount[muscle] || 0) + effectiveSets;
    getMuscleGroupParents(muscle).forEach((p) => {
      setsCount[p] = (setsCount[p] || 0) + effectiveSets;
    });
  };

  const countFromPlan = (workoutPlan: any[]) => {
    Object.values(MuscleGroup).forEach((m) => (setsCount[m] = 0));

    workoutPlan.forEach((w: any) => {
      w.exercises.forEach((e: any) => {
        addSets(e.primaryMuscle, e.targetSets, e.isUnilateral, 1);
        (e.secondaryMuscle || []).forEach((s: MuscleGroup) => {
          addSets(s, e.targetSets, e.isUnilateral, 0.5);
        });
      });
    });
  };

  return { setsCount, addSets, countFromPlan };
}

function adjustVolumeAlgorithm(
  workoutPlan: any[],
  volumeAnalysis: any[],
): any[] {
  const mutablePlan = JSON.parse(JSON.stringify(workoutPlan));
  const { setsCount, countFromPlan } = createSetsCounter();

  const volumeLedger: { [key in MuscleGroup]?: number } = {};
  volumeAnalysis.forEach((v: any) => {
    volumeLedger[v.muscleGroup as MuscleGroup] = v.newSuggestedTotalSets;
  });

  const adjustmentOrder: MuscleGroup[] = [
    MuscleGroup.CHEST_TOTAL,
    MuscleGroup.BACK_TOTAL,
    MuscleGroup.QUADRICEPS,
    MuscleGroup.HAMSTRINGS,
    MuscleGroup.GLUTES,
    MuscleGroup.SHOULDERS_FRONT_DELT,
    MuscleGroup.SHOULDERS_SIDE_DELT,
    MuscleGroup.SHOULDERS_REAR_DELT,
    MuscleGroup.TRICEPS_TOTAL,
    MuscleGroup.BICEPS_TOTAL,
    MuscleGroup.CALVES,
    MuscleGroup.FOREARMS,
    MuscleGroup.ABS_TOTAL,
  ];

  for (const muscle of adjustmentOrder) {
    if (volumeLedger[muscle] === undefined) continue;

    const targetVolume = volumeLedger[muscle] ?? 0;

    countFromPlan(mutablePlan);
    let currentVolume = setsCount[muscle] ?? 0;
    let diff = targetVolume - currentVolume;

    if (Math.abs(diff) < 0.49) continue;

    console.log(
      `[CASCADE] ${muscle}: Meta ${targetVolume}, Atual ${currentVolume.toFixed(2)}, Diff ${diff.toFixed(2)}`,
    );

    const directExercises = mutablePlan
      .flatMap((w: any) =>
        w.exercises.map((e: any) => ({ exercise: e, workoutName: w.name })),
      )
      .filter((item: any) => {
        const pMuscle = item.exercise.primaryMuscle as MuscleGroup;
        return (
          pMuscle === muscle || getMuscleGroupParents(pMuscle).includes(muscle)
        );
      })
      .sort((a: any, b: any) => {
        return diff > 0
          ? a.exercise.targetSets - b.exercise.targetSets
          : b.exercise.targetSets - a.exercise.targetSets;
      });

    if (!directExercises.length) continue;

    const initialSign = Math.sign(diff);
    let cycle = 0;
    let attemptsWithoutChange = 0;
    const totalEligible = directExercises.length;

    while (Math.abs(diff) > 0.49 && attemptsWithoutChange < totalEligible) {
      const item = directExercises[cycle % totalEligible];
      const ex = item.exercise;

      const isUni =
        ex.isUnilateral === true ||
        ex.isUnilateral === "true" ||
        String(ex.isUnilateral) === "true";
      const setsChange = isUni ? 2 * initialSign : 1 * initialSign;
      const nextSets = ex.targetSets + setsChange;

      let canApply = false;
      if (isUni) {
        if (nextSets >= 4 && nextSets <= 8) canApply = true;
      } else {
        if (nextSets >= 2 && nextSets <= 4) canApply = true;
      }

      if (canApply) {
        const oldSets = ex.targetSets;
        ex.targetSets = nextSets;
        attemptsWithoutChange = 0;

        const volumeChange =
          (isUni ? Math.abs(setsChange) / 2 : Math.abs(setsChange)) *
          initialSign;
        diff -= volumeChange;

        console.log(
          `[CASCADE]   -> ${item.workoutName}: ${ex.exerciseName} ${oldSets} -> ${nextSets} (isUni: ${isUni})`,
        );

        if (Math.sign(diff) !== initialSign && Math.abs(diff) > 0.01) {
          console.log(
            `[CASCADE]   -> Meta atingida para ${muscle} com leve overshoot.`,
          );
          break;
        }
      } else {
        attemptsWithoutChange++;
      }
      cycle++;
    }
  }

  mutablePlan.forEach((w: any) => {
    w.exercises.forEach((e: any) => {
      const isUni =
        e.isUnilateral === true ||
        e.isUnilateral === "true" ||
        String(e.isUnilateral) === "true";
      e.targetSets = clampSets(e.targetSets, isUni);
    });
  });

  return mutablePlan;
}

export const generateNextMacroCycleService = async ({
  macroCycleId,
  userId,
  modifications,
  maxSetsPerMicroCycle = 24,
  // TODO: legPriority para funcionalidade futura (não utilizada ainda)
  // legPriority = "Quadríceps (Total)",
}: IGenerateNextMacroCycle): Promise<{
  generatedMacroCycle: IMacroCycle & { volumeReport?: VolumeAnalysis[] };
}> => {
  const macroCycleRepo = AppDataSource.getRepository(MacroCycle);
  const userRepo = AppDataSource.getRepository(User);
  const exerciseRepo = AppDataSource.getRepository(Exercise);

  const user = await userRepo.findOneBy({ id: userId });
  if (!user) throw new AppError("Usuário não encontrado", 404);

  const referenceMacroCycle = await macroCycleRepo.findOne({
    where: { id: macroCycleId, user: { id: userId } },
    relations: {
      microCycles: {
        cycleItems: {
          workout: {
            workoutExercises: { exercise: true },
          },
        },
      },
    },
    order: {
      microCycles: {
        cycleItems: {
          position: "ASC",
          workout: {
            workoutExercises: {
              position: "ASC",
            },
          },
        },
      },
    },
  });

  if (!referenceMacroCycle)
    throw new AppError("Macro ciclo de referência não encontrado", 404);

  const volumeAnalysis = await adjustVolumeService(macroCycleId, userId, {
    weights: { firstVsLast: 0.6, weeklyAverage: 0.4 },
    rules: {
      increase: [
        { threshold: 20, percentage: 20 },
        { threshold: 15, percentage: 15 },
        { threshold: 10, percentage: 10 },
      ],
      decrease: [
        { threshold: -20, percentage: -20 },
        { threshold: -15, percentage: -15 },
        { threshold: -10, percentage: -10 },
      ],
      maintain: { threshold: 9 },
    },
    maxSetsPerMicroCycle,
  });

  const sortedMicroCycles = [...referenceMacroCycle.microCycles].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  const referenceMicroCycle = sortedMicroCycles[sortedMicroCycles.length - 1];

  if (!referenceMicroCycle) {
    throw new AppError(
      "Nenhum microciclo encontrado no macro ciclo de referência",
      404,
    );
  }

  const oldWorkoutPlan = referenceMicroCycle.cycleItems.map((ci) => ({
    name: ci.workout.name,
    exercises: ci.workout.workoutExercises.map((we) => {
      const isUnilateral =
        we.is_unilateral === true ||
        (we.is_unilateral as any) === 1 ||
        (we.is_unilateral as any) === "true";

      return {
        exerciseName: we.exercise.name,
        targetSets: clampSets(we.targetSets, isUnilateral),
        effectiveSets: isUnilateral ? we.targetSets / 2 : we.targetSets,
        primaryMuscle: we.exercise.primaryMuscle,
        secondaryMuscle: we.exercise.secondaryMuscle,
        position: we.position,
        isUnilateral,
      };
    }),
  }));

  const allExercises = await exerciseRepo.find();

  let workoutPlan = JSON.parse(JSON.stringify(oldWorkoutPlan));

  if (modifications && modifications.length > 0) {
    workoutPlan = applyManualModifications(
      workoutPlan,
      modifications,
      allExercises,
    );
  }

  console.log("Iniciando ajuste de volume em cascata...");
  const finalPlanRaw = adjustVolumeAlgorithm(workoutPlan, volumeAnalysis);

  const finalPlan = {
    workouts: finalPlanRaw.map((w: any) => ({
      name: w.name,
      exercises: w.exercises.map((e: any) => {
        const isUni =
          e.isUnilateral === true ||
          e.isUnilateral === "true" ||
          e.isUnilateral === 1;
        const clampedSets = clampSets(e.targetSets, isUni);

        return {
          exerciseName: e.exerciseName,
          targetSets: clampedSets,
          isUnilateral: isUni,
        };
      }),
    })),
  };

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const newMacroCycle = new MacroCycle();
    newMacroCycle.user = user;
    newMacroCycle.macroCycleName = generateMacroCycleName(referenceMacroCycle);

    const microcyclesCount =
      referenceMacroCycle.microCycles?.length ||
      referenceMacroCycle.microQuantity ||
      1;
    newMacroCycle.microQuantity = microcyclesCount;
    newMacroCycle.startDate = new Date().toISOString().split("T")[0];

    const duration =
      new Date(referenceMacroCycle.endDate).getTime() -
      new Date(referenceMacroCycle.startDate).getTime();
    newMacroCycle.endDate = new Date(new Date().getTime() + duration)
      .toISOString()
      .split("T")[0];

    await queryRunner.manager.save(newMacroCycle);
    newMacroCycle.microCycles = [];

    for (let i = 0; i < microcyclesCount; i++) {
      const newMicroCycle = new MicroCycle();
      newMicroCycle.user = user;
      newMicroCycle.macroCycle = newMacroCycle;
      newMicroCycle.microCycleName = generateMicroCycleName(
        referenceMicroCycle,
        i + 1,
      );
      newMicroCycle.trainingDays = referenceMicroCycle.trainingDays ?? [];

      await queryRunner.manager.save(newMicroCycle);
      newMacroCycle.microCycles.push(newMicroCycle);

      let workoutPosition = 0;
      for (const workoutData of finalPlan.workouts) {
        const newWorkout = new Workout();
        newWorkout.name = workoutData.name;
        await queryRunner.manager.save(newWorkout);

        let workoutExercisePosition = 0;
        for (const exerciseData of workoutData.exercises) {
          const exercise = allExercises.find(
            (e) => e.name === exerciseData.exerciseName,
          );
          if (!exercise)
            throw new AppError(
              `Exercício "${exerciseData.exerciseName}" não encontrado.`,
            );

          const newWorkoutExercise = new WorkoutExercise();
          newWorkoutExercise.workout = newWorkout;
          newWorkoutExercise.exercise = exercise;
          newWorkoutExercise.position = workoutExercisePosition;

          const isUni = exerciseData.isUnilateral === true;
          const finalSets = Math.min(exerciseData.targetSets, isUni ? 8 : 4);

          if (finalSets !== exerciseData.targetSets) {
            console.error(
              `[FATAL CLAMP] Tentativa de salvar ${exerciseData.targetSets} sets para ${exerciseData.exerciseName} (isUni: ${isUni}). Forçado para ${finalSets}.`,
            );
          }

          newWorkoutExercise.targetSets = finalSets;
          newWorkoutExercise.is_unilateral = isUni;

          await queryRunner.manager.save(newWorkoutExercise);
          workoutExercisePosition++;
        }

        const microCycleItem = new MicroCycleItem();
        microCycleItem.microCycle = newMicroCycle;
        microCycleItem.workout = newWorkout;
        microCycleItem.position = workoutPosition;
        await queryRunner.manager.save(microCycleItem);

        workoutPosition++;
      }
    }

    await queryRunner.commitTransaction();

    const savedMacroCycle = await queryRunner.manager.findOne(MacroCycle, {
      where: { id: newMacroCycle.id },
      relations: {
        microCycles: {
          cycleItems: {
            workout: {
              workoutExercises: { exercise: true },
            },
          },
        },
      },
    });

    if (!savedMacroCycle)
      throw new AppError("Falha ao carregar o macro ciclo criado", 500);

    const response: IMacroCycle & { volumeReport?: VolumeAnalysis[] } = {
      ...savedMacroCycle,
      startDate: formatDateToDDMMYYYY(savedMacroCycle.startDate),
      endDate: formatDateToDDMMYYYY(savedMacroCycle.endDate),
      volumeReport: volumeAnalysis,
    };

    return { generatedMacroCycle: response };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw new AppError("Falha ao gerar um novo macro ciclo", 500);
  } finally {
    await queryRunner.release();
  }
};
