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
    increase: { threshold: number; percentage: number };
    decrease: { threshold: number; percentage: number };
    maintain: { threshold: number };
  };
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
      "user",
    ],
  });

  if (!macroCycle) {
    throw new AppError("Macrociclo não encontrado ou não pertence ao usuário.", 404);
  }

  if (macroCycle.items.length < 2) {
    throw new AppError("O macrociclo precisa de pelo menos 2 microciclos para análise.", 400);
  }

  // Ordenar microciclos pela data de criação
  const sortedItems = macroCycle.items.sort(
    (a, b) => new Date(a.microCycle.createdAt).getTime() - new Date(b.microCycle.createdAt).getTime()
  );

  const volumesByMuscleGroup: { [key in MuscleGroup]?: number[] } = {};

  for (const item of sortedItems) {
    for (const volume of item.microCycle.volumes) {
      if (!volumesByMuscleGroup[volume.muscleGroup]) {
        volumesByMuscleGroup[volume.muscleGroup] = [];
      }
      volumesByMuscleGroup[volume.muscleGroup]!.push(volume.totalVolume);
    }
  }

  const analysisResults: VolumeAnalysis[] = [];

  for (const muscleGroupStr in volumesByMuscleGroup) {
    const muscleGroup = muscleGroupStr as MuscleGroup;
    const volumes = volumesByMuscleGroup[muscleGroup]!;

    if (volumes.length < 2) {
      continue;
    }

    // 1. Cálculo "Primeiro vs. Último"
    const firstVolume = volumes[0];
    const lastVolume = volumes[volumes.length - 1];
    let firstVsLastChange: number | null = null;
    if (firstVolume > 0) {
      firstVsLastChange = ((lastVolume - firstVolume) / firstVolume) * 100;
    }

    // 2. Cálculo "Média Semana-a-Semana"
    const weeklyChanges: number[] = [];
    for (let i = 0; i < volumes.length - 1; i++) {
      const current = volumes[i];
      const next = volumes[i + 1];
      if (current > 0) {
        const change = ((next - current) / current) * 100;
        weeklyChanges.push(change);
      }
    }
    const weeklyAverageChange = weeklyChanges.length > 0
      ? weeklyChanges.reduce((a, b) => a + b, 0) / weeklyChanges.length
      : null;

    // 3. Combinação
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


    // 4. Decisão
    let suggestion: "increase" | "decrease" | "maintain" = "maintain";
    let adjustmentPercentage = 0;
    let reason = "";

    if (combinedChange > options.rules.increase.threshold) {
      suggestion = "increase";
      adjustmentPercentage = options.rules.increase.percentage;
      reason = `O aumento combinado de ${combinedChange.toFixed(2)}% excedeu o limite de ${options.rules.increase.threshold}%.`;
    } else if (combinedChange < options.rules.decrease.threshold) {
      suggestion = "decrease";
      adjustmentPercentage = options.rules.decrease.percentage;
      reason = `A queda combinada de ${combinedChange.toFixed(2)}% foi abaixo do limite de ${options.rules.decrease.threshold}%.`;
    } else {
      suggestion = "maintain";
      adjustmentPercentage = 0;
      reason = `A variação combinada de ${combinedChange.toFixed(2)}% está dentro dos limites para manutenção.`;
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
    });
  }

  return analysisResults;
};
