import { AppDataSource } from "../../data-source";
import { MacroCycle } from "../../entities/macroCycle.entity";
import { MicroCycle } from "../../entities/microCycle.entity"; // Added this line
import { AppError } from "../../errors";
import {
  MuscleGroup,
  getMuscleGroupParents,
  MuscleGroupHierarchy,
} from "../../enum/muscleGroup.enum";

interface AdjustmentOptions {
  weights: {
    firstVsLast: number;
    weeklyAverage: number;
  };
  rules: {
    increase: { threshold: number; percentage: number }[];
    decrease: { threshold: number; percentage: number }[];
    maintain: { threshold: number };
  };
  maxSetsPerMicroCycle?: number;
}

interface VolumeAnalysis {
  muscleGroup: MuscleGroup;
  volumes: number[];
  firstVsLastChange: number | null;
  weeklyAverageChange: number | null;
  combinedChange: number;
  suggestion: "increase" | "decrease" | "maintain";
  adjustmentPercentage: number;
  reason: string;
  totalSets: number;
  newSuggestedTotalSets: number;
}

export const adjustVolumeService = async (
  macroCycleId: string,
  userId: string,
  options: AdjustmentOptions
): Promise<VolumeAnalysis[]> => {
  const macroCycleRepo = AppDataSource.getRepository(MacroCycle);

  const macroCycle = await macroCycleRepo.findOne({
    where: { id: macroCycleId, user: { id: userId } },
    relations: [
      "microCycles",
      "microCycles.volumes",
      "microCycles.cycleItems",
      "microCycles.cycleItems.workout",
      "microCycles.cycleItems.workout.workoutExercises",
      "microCycles.cycleItems.workout.workoutExercises.exercise",
      "user",
    ],
  });

  if (!macroCycle) {
    throw new AppError(
      "Macrociclo não encontrado ou não pertence ao usuário.",
      404
    );
  }

  if ((macroCycle.microCycles?.length || 0) < 2) {
    throw new AppError(
      "O macrociclo precisa de pelo menos 2 microciclos para análise.",
      400
    );
  }

  const sortedItems = macroCycle.microCycles.sort(
    (a: MicroCycle, b: MicroCycle) =>
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime()
  );

  const volumesByMuscleGroup: { [key: string]: number[] } = {};

  for (const item of sortedItems) {
    for (const volume of item.volumes) { // Changed here
      const mg = volume.muscleGroup as MuscleGroup;
      if (!volumesByMuscleGroup[mg]) volumesByMuscleGroup[mg] = [];
      volumesByMuscleGroup[mg].push(volume.totalVolume);

      const parents = getMuscleGroupParents(mg);
      for (const parent of parents) {
        if (!volumesByMuscleGroup[parent]) volumesByMuscleGroup[parent] = [];
        volumesByMuscleGroup[parent].push(volume.totalVolume);
      }
    }
  }

  const referenceMicroCycle = sortedItems[0]; // Changed here
  const totalSetsByMuscleGroup: { [key: string]: number } = {};

  const addSetsToHierarchy = (muscle: MuscleGroup, sets: number) => {
    totalSetsByMuscleGroup[muscle] =
      (totalSetsByMuscleGroup[muscle] || 0) + sets;
    const parents = getMuscleGroupParents(muscle);
    for (const parent of parents) {
      totalSetsByMuscleGroup[parent] =
        (totalSetsByMuscleGroup[parent] || 0) + sets;
    }
  };

  if (referenceMicroCycle.cycleItems) {
    for (const cycleItem of referenceMicroCycle.cycleItems) {
      const workout = cycleItem.workout;
      if (workout && workout.workoutExercises) {
        for (const workoutExercise of workout.workoutExercises) {
          const primaryMuscle = workoutExercise.exercise.primaryMuscle;
          const secondaryMuscles = workoutExercise.exercise.secondaryMuscle;
          const sets = workoutExercise.targetSets;

          if (primaryMuscle) {
            addSetsToHierarchy(primaryMuscle, sets);
          }

          if (secondaryMuscles) {
            for (const secondaryMuscle of secondaryMuscles) {
              addSetsToHierarchy(secondaryMuscle, sets * 0.5);
            }
          }
        }
      }
    }
  }

  const analysisResults: VolumeAnalysis[] = [];

  for (const muscleGroupStr in volumesByMuscleGroup) {
    const isSubgroup = Object.values(MuscleGroupHierarchy).some((subgroups) =>
      subgroups.includes(muscleGroupStr as MuscleGroup)
    );

    if (isSubgroup) {
      continue;
    }

    const muscleGroup = muscleGroupStr as MuscleGroup;
    const volumes = volumesByMuscleGroup[muscleGroup]!;

    if (volumes.length < 2) {
      continue;
    }

    const firstVolume = volumes[0];
    const lastVolume = volumes[volumes.length - 1];
    let firstVsLastChange: number | null = null;
    if (firstVolume > 0) {
      firstVsLastChange = ((lastVolume - firstVolume) / firstVolume) * 100;
    }

    const weeklyChanges: number[] = [];
    for (let i = 0; i < volumes.length - 1; i++) {
      const current = volumes[i];
      const next = volumes[i + 1];
      if (current > 0) {
        const change = ((next - current) / current) * 100;
        weeklyChanges.push(change);
      }
    }
    const weeklyAverageChange =
      weeklyChanges.length > 0
        ? weeklyChanges.reduce((a, b) => a + b, 0) / weeklyChanges.length
        : null;

    let combinedChange = 0;
    if (firstVsLastChange !== null && weeklyAverageChange !== null) {
      combinedChange =
        firstVsLastChange * options.weights.firstVsLast +
        weeklyAverageChange * options.weights.weeklyAverage;
    } else if (firstVsLastChange !== null) {
      combinedChange = firstVsLastChange;
    } else if (weeklyAverageChange !== null) {
      combinedChange = weeklyAverageChange;
    }

    const sortedIncreaseRules = options.rules.increase.sort(
      (a, b) => b.threshold - a.threshold
    );
    const sortedDecreaseRules = options.rules.decrease.sort(
      (a, b) => a.threshold - b.threshold
    );

    let suggestion: "increase" | "decrease" | "maintain" = "maintain";
    let adjustmentPercentage = 0;
    let reason = "";

    let appliedRule = false;
    if (combinedChange > options.rules.maintain.threshold) {
      for (const rule of sortedIncreaseRules) {
        if (combinedChange >= rule.threshold) {
          suggestion = "increase";
          adjustmentPercentage = rule.percentage;
          reason = `O aumento combinado de ${combinedChange.toFixed(
            2
          )}% excedeu o limite de ${rule.threshold}%.`;
          appliedRule = true;
          break;
        }
      }
    } else {
      for (const rule of sortedDecreaseRules) {
        if (combinedChange < rule.threshold) {
          suggestion = "decrease";
          adjustmentPercentage = rule.percentage;
          reason = `A queda combinada de ${combinedChange.toFixed(
            2
          )}% foi abaixo do limite de ${rule.threshold}%.`;
          appliedRule = true;
          break;
        }
      }
    }

    if (!appliedRule) {
      suggestion = "maintain";
      adjustmentPercentage = 0;
      reason = `A variação combinada de ${combinedChange.toFixed(
        2
      )}% está dentro dos limites para manutenção.`;
    }

    const totalSets = totalSetsByMuscleGroup[muscleGroup] || 0;
    const newTotalSets = totalSets * (1 + adjustmentPercentage / 100);
    let newSuggestedTotalSets = Math.round(newTotalSets * 2) / 2;

    const maxSets = options.maxSetsPerMicroCycle ?? 24;

    if (newSuggestedTotalSets > maxSets) {
      newSuggestedTotalSets = maxSets;
      reason += ` O valor foi limitado ao máximo de ${maxSets} sets por microciclo.`;
    }

    analysisResults.push({
      muscleGroup,
      volumes,
      firstVsLastChange,
      weeklyAverageChange,
      combinedChange,
      suggestion,
      adjustmentPercentage,
      reason,
      totalSets,
      newSuggestedTotalSets,
    });
  }

  return analysisResults;
};
