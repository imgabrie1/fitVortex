import { AppDataSource } from "../../data-source";
import { MacroCycle } from "../../entities/macroCycle.entity";
import { AppError } from "../../errors";
import { MuscleGroup } from "../../enum/muscleGroup.enum";

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
      "items",
      "items.microCycle",
      "items.microCycle.volumes",
      "items.microCycle.cycleItems",
      "items.microCycle.cycleItems.workout",
      "items.microCycle.cycleItems.workout.workoutExercises",
      "items.microCycle.cycleItems.workout.workoutExercises.exercise",
      "user",
    ],
  });

  if (!macroCycle) {
    throw new AppError(
      "Macrociclo não encontrado ou não pertence ao usuário.",
      404
    );
  }

  if (macroCycle.items.length < 2) {
    throw new AppError(
      "O macrociclo precisa de pelo menos 2 microciclos para análise.",
      400
    );
  }

  const sortedItems = macroCycle.items.sort(
    (a, b) =>
      new Date(a.microCycle.createdAt).getTime() -
      new Date(b.microCycle.createdAt).getTime()
  );

  const volumesByMuscleGroup: { [key: string]: number[] } = {};
  for (const item of sortedItems) {
    for (const volume of item.microCycle.volumes) {
      const muscleGroupKey = volume.muscleGroup as string;
      if (!volumesByMuscleGroup[muscleGroupKey]) {
        volumesByMuscleGroup[muscleGroupKey] = [];
      }
      volumesByMuscleGroup[muscleGroupKey]!.push(volume.totalVolume);
    }
  }

  const referenceMicroCycle = sortedItems[0].microCycle;
  const totalSetsByMuscleGroup: { [key: string]: number } = {};

  if (referenceMicroCycle.cycleItems) {
    for (const cycleItem of referenceMicroCycle.cycleItems) {
      const workout = cycleItem.workout;
      if (workout && workout.workoutExercises) {
        for (const workoutExercise of workout.workoutExercises) {
          const primaryMuscleKey = workoutExercise.exercise
            .primaryMuscle as string;
          const secondaryMuscleKey = workoutExercise.exercise
            .secondaryMuscle as string | null;
          const sets = workoutExercise.targetSets;

          if (!totalSetsByMuscleGroup[primaryMuscleKey]) {
            totalSetsByMuscleGroup[primaryMuscleKey] = 0;
          }
          totalSetsByMuscleGroup[primaryMuscleKey] += sets;

          if (secondaryMuscleKey) {
            if (!totalSetsByMuscleGroup[secondaryMuscleKey]) {
              totalSetsByMuscleGroup[secondaryMuscleKey] = 0;
            }
            totalSetsByMuscleGroup[secondaryMuscleKey] += sets * 0.5;
          }
        }
      }
    }
  }

  const analysisResults: VolumeAnalysis[] = [];

  for (const muscleGroupStr in volumesByMuscleGroup) {
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
