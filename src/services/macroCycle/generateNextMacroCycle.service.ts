import { AppDataSource } from "../../data-source";
import { MacroCycle } from "../../entities/macroCycle.entity";
import { AppError } from "../../errors";
import { adjustVolumeService } from "./adjustVolume.service";
import { User } from "../../entities/user.entity";
import { MicroCycle } from "../../entities/microCycle.entity";
import { Workout } from "../../entities/workout.entity";
import { WorkoutExercise } from "../../entities/workoutExercise.entity";
import { Exercise } from "../../entities/exercise.entity";
import { MacroCycleItem } from "../../entities/macroCycleItem.entity";
import { MicroCycleItem } from "../../entities/microCycleItem.entity";

import { GoogleGenAI } from "@google/genai";
import {
  MuscleGroup,
  getMuscleGroupParents,
} from "../../enum/muscleGroup.enum";

const generateMacroCycleName = (ref?: any) =>
  ref?.macroCycleName
    ? `${ref.macroCycleName} — próximo`
    : `Macrocycle ${new Date().toISOString().split("T")[0]}`;

const generateMicroCycleName = (refMicro?: any, idx = 1) =>
  refMicro?.microCycleName
    ? `${refMicro.microCycleName} — copy ${idx}`
    : `Microcycle ${new Date().toISOString().split("T")[0]} #${idx}`;

interface IGenerateNextMacroCycle {
  macroCycleId: string;
  userId: string;
  prompt: string;
  createNewWorkout: boolean;
  maxSetsPerMicroCycle?: number;
  legPriority?: "Quadríceps (Total)" | "Posterior de Coxa (Total)";
}

interface IWorkoutPlan {
  workouts: {
    name: string;
    exercises: {
      exerciseName: string;
      targetSets: number;
    }[];
  }[];
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new AppError("GEMINI_API_KEY env não existe");
}
const genai = new GoogleGenAI({ apiKey });
const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

function validateWorkoutPlan(obj: any): obj is IWorkoutPlan {
  if (!obj || typeof obj !== "object") return false;
  if (!Array.isArray(obj.workouts)) return false;
  for (const w of obj.workouts) {
    if (typeof w.name !== "string") return false;
    if (!Array.isArray(w.exercises)) return false;
    for (const e of w.exercises) {
      if (typeof e.exerciseName !== "string") return false;
      if (typeof e.targetSets !== "number") return false;
    }
  }
  return true;
}

export const generateNextMacroCycleService = async ({
  macroCycleId,
  userId,
  prompt,
  createNewWorkout,
  maxSetsPerMicroCycle = 24,
  legPriority = "Quadríceps (Total)",
}: IGenerateNextMacroCycle): Promise<MacroCycle> => {
  const macroCycleRepo = AppDataSource.getRepository(MacroCycle);
  const userRepo = AppDataSource.getRepository(User);
  const exerciseRepo = AppDataSource.getRepository(Exercise);

  const user = await userRepo.findOneBy({ id: userId });
  if (!user) throw new AppError("Usuário não encontrado", 404);

  const referenceMacroCycle = await macroCycleRepo.findOne({
    where: { id: macroCycleId, user: { id: userId } },
    relations: {
      items: {
        microCycle: {
          cycleItems: {
            workout: {
              workoutExercises: { exercise: true },
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
  });

  const referenceMicroCycle = referenceMacroCycle.items[0].microCycle;
  const oldWorkoutPlan = referenceMicroCycle.cycleItems.map((ci) => ({
    name: ci.workout.name,
    exercises: ci.workout.workoutExercises.map((we) => {
      const isUnilateral = we.exercise.default_unilateral;
      const effectiveSets = isUnilateral ? we.targetSets / 2 : we.targetSets;

      return {
        exerciseName: we.exercise.name,
        targetSets: we.targetSets,
        effectiveSets,
        primaryMuscle: we.exercise.primaryMuscle,
        secondaryMuscle: we.exercise.secondaryMuscle,
        position: we.position,
        isUnilateral,
      };
    }),
  }));

  const dbExercises = await exerciseRepo.find();
  const exercisesForPrompt = dbExercises.map((e) => ({
    name: e.name,
    primaryMuscle: e.primaryMuscle,
    secondaryMuscles: e.secondaryMuscle,
    default_unilateral: e.default_unilateral,
  }));

  const analysisForPrompt = volumeAnalysis.map(
    ({ muscleGroup, newSuggestedTotalSets, suggestion, combinedChange }) => ({
      muscleGroup,
      newSuggestedTotalSets,
      suggestion,
      combinedChange: combinedChange.toFixed(2) + "%",
    })
  );

  let newWorkoutPlan: IWorkoutPlan;

  if (createNewWorkout) {
    const aiPrompt = `Você é um especialista em periodização de treinos. Sua tarefa é criar um plano de treino otimizado baseado na análise de performance e objetivos do usuário.

OBJETIVO DO USUÁRIO: "${prompt}"

PRIORIDADE DE PERNAS: ${
      legPriority === "Quadríceps (Total)"
        ? "Quadríceps (60%) / Posterior de Coxa (Total) (40%)"
        : "Posterior de Coxa (Total) (60%) / Quadríceps (40%)"
    }

ANÁLISE DE PERFORMANCE (ÚLTIMO MACROCICLO):
${JSON.stringify(analysisForPrompt, null, 2)}

ESTRUTURA ANTERIOR (PARA CONTEXTO):
${JSON.stringify(oldWorkoutPlan, null, 2)}

EXERCÍCIOS DISPONÍVEIS:
${JSON.stringify(exercisesForPrompt, null, 2)}

--- REGRAS ESTRUTURAIS (DIRETRIZES FLEXÍVEIS) ---

PRIORIDADE MÁXIMA: Os volumes totais por grupo muscular DEVEM aproximar-se ao máximo dos 'newSuggestedTotalSets' da análise. Esta é a prioridade principal.

DIRETRIZES POR TIPO DE TREINO (use como referência, adapte se necessário):

FULLBODY:
• 2 músculos principais: 2 exercícios cada (máx 3 séries cada)
• Outros músculos: 1 exercício cada
• Músculos grandes: 4 séries, menores: 3 séries
• Total: 6-7 exercícios, 18-22 séries/dia

PUSH/PULL (quando aplicável):
• 1º foco: 50% do volume, 3 exercícios
• 2º foco: 33% do volume, 2 exercícios
• 3º foco: 17% do volume, 1 exercício

PERNAS (dia único):
• ${
      legPriority === "Quadríceps (Total)"
        ? "Quadríceps: 60% do volume | Posterior de Coxa (Total): 40%"
        : "Posterior de Coxa (Total): 60% do volume | Quadríceps: 40%"
    }

REGRA DOS EXERCÍCIOS UNILATERAIS:
• Exercícios com 'default_unilateral: true' devem ter suas séries consideradas como METADE no cálculo de volume
• Exemplo: 4 séries de agachamento unilateral = 2 séries efetivas no cálculo

LIMITES:
• Máximo ${maxSetsPerMicroCycle} séries totais por microciclo para qualquer grupo muscular
• Mínimo 1 série por exercício

--- INSTRUÇÕES DE RESPOSTA ---

1) ANALISE o nome de cada workout para identificar o tipo (Fullbody, Push, Pull, Legs, etc.)
2) APLIQUE as diretrizes correspondentes, mas PRIORIZE atingir os volumes sugeridos
3) USE APENAS exercícios da lista disponível, com nomes IDÊNTICOS
4) CONSIDERE 'default_unilateral' nos cálculos de volume
5) SEJA FLEXÍVEL: se para atingir os volumes precisar desviar das diretrizes, faça ajustes inteligentes (±1-2 séries)

RESPOSTA OBRIGATÓRIA (APENAS JSON):
{
  "workouts": [
    {
      "name": "Nome do Treino",
      "exercises": [
        {
          "exerciseName": "Nome Exato do Exercício",
          "targetSets": 4
        }
      ]
    }
  ]
}

Lembre-se: VOLUMES SUGERIDOS > ESTRUTURA IDEAL. Seja criativo na distribuição!`;

    let aiRawText: string | null = null;
    try {
      const model = DEFAULT_MODEL;
      const resp: any = await genai.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: aiPrompt }] }],
        config: {
          responseMimeType: "application/json",
          maxOutputTokens: 1200,
          temperature: 0.3,
        },
      });
      aiRawText =
        resp?.candidates?.[0]?.content?.[0]?.parts?.[0]?.text ??
        resp?.text ??
        null;
    } catch (err: any) {
      console.error(
        "Erro no Gemini SDK:",
        err?.response ?? err?.message ?? err
      );
      throw new AppError("Requisição de serviço com IA falhou", 502);
    }

    if (!aiRawText) {
      throw new AppError("AI retornou um texto inútil", 502);
    }

    try {
      const cleaned =
        typeof aiRawText === "string"
          ? aiRawText.replace(/```json|```/g, "").trim()
          : aiRawText;
      newWorkoutPlan =
        typeof cleaned === "string"
          ? JSON.parse(cleaned)
          : (cleaned as IWorkoutPlan);
    } catch (parseErr) {
      console.error(
        "Falha fazer o parse de JSON com IA:",
        parseErr,
        "raw:",
        aiRawText
      );
      throw new AppError("Falha fazer o parse de JSON com IA", 502);
    }

    if (!validateWorkoutPlan(newWorkoutPlan)) {
      console.error("IA retornou um plano de treino inválido:", newWorkoutPlan);
      throw new AppError("IA retornou um plano de treino inválido", 502);
    }
  } else {
    const volumeLedger: { [key in MuscleGroup]?: number } = {};
    volumeAnalysis.forEach((v) => {
      volumeLedger[v.muscleGroup] = v.newSuggestedTotalSets;
    });

    const mutableWorkoutPlan = JSON.parse(JSON.stringify(oldWorkoutPlan));

    const originalTotals: { [key: string]: number } = {};
    Object.values(MuscleGroup).forEach((m) => (originalTotals[m] = 0));

    oldWorkoutPlan.forEach((w) => {
      w.exercises.forEach((e) => {
        const primary = e.primaryMuscle as MuscleGroup;
        const secondaries = (e.secondaryMuscle || []) as MuscleGroup[];
        originalTotals[primary] += e.effectiveSets;
        getMuscleGroupParents(primary).forEach(
          (p) => (originalTotals[p] += e.effectiveSets)
        );
        secondaries.forEach((s) => {
          originalTotals[s] += e.effectiveSets * 0.5;
          getMuscleGroupParents(s).forEach(
            (p) => (originalTotals[p] += e.effectiveSets * 0.5)
          );
        });
      });
    });

    for (const workout of mutableWorkoutPlan) {
      for (const exercise of workout.exercises) {
        const primaryMuscle = exercise.primaryMuscle as MuscleGroup;
        const relevantLedgerMuscle = [
          primaryMuscle,
          ...getMuscleGroupParents(primaryMuscle),
        ].find((m) => volumeLedger[m] !== undefined);

        if (relevantLedgerMuscle && originalTotals[relevantLedgerMuscle] > 0) {
          const oldProportion =
            exercise.effectiveSets / originalTotals[relevantLedgerMuscle];
          const newTargetSets =
            (volumeLedger[relevantLedgerMuscle] ?? 0) * oldProportion;

          exercise.targetSets = exercise.isUnilateral
            ? Math.max(2, Math.round(newTargetSets * 2))
            : Math.max(1, Math.round(newTargetSets));
        }
      }
    }

    const postAiSetsCount: { [key: string]: number } = {};
    Object.values(MuscleGroup).forEach((m) => (postAiSetsCount[m] = 0));

    const addSetsToCount = (
      muscle: MuscleGroup,
      sets: number,
      isUnilateral: boolean,
      multiplier: number
    ) => {
      const effectiveSets = (isUnilateral ? sets / 2 : sets) * multiplier;
      postAiSetsCount[muscle] = (postAiSetsCount[muscle] || 0) + effectiveSets;
      getMuscleGroupParents(muscle).forEach((p) => {
        postAiSetsCount[p] = (postAiSetsCount[p] || 0) + effectiveSets;
      });
    };

    mutableWorkoutPlan.forEach((w: any) => {
      w.exercises.forEach((e: any) => {
        addSetsToCount(e.primaryMuscle, e.targetSets, e.isUnilateral, 1);
        (e.secondaryMuscle || []).forEach((s: MuscleGroup) => {
          addSetsToCount(s, e.targetSets, e.isUnilateral, 0.5);
        });
      });
    });

    for (const muscleStr in volumeLedger) {
      const muscle = muscleStr as MuscleGroup;
      const needed = volumeLedger[muscle] ?? 0;
      const current = postAiSetsCount[muscle] ?? 0;
      let diff = needed - current;

      const exercisesForGroup = mutableWorkoutPlan
        .flatMap((w: any) => w.exercises)
        .map((e: any) => {
          const pMuscle = e.primaryMuscle as MuscleGroup;
          const sMuscles = (e.secondaryMuscle || []) as MuscleGroup[];

          const isPrimary =
            pMuscle === muscle ||
            getMuscleGroupParents(pMuscle).includes(muscle);
          const isSecondary =
            sMuscles.includes(muscle) ||
            sMuscles.some((s) => getMuscleGroupParents(s).includes(muscle));

          return {
            exercise: e,
            isPrimary,
            isSecondary,
          };
        })
        .filter((item: any) => item.isPrimary || item.isSecondary)
        .sort((a: any, b: any) => {
          if (a.isPrimary && !b.isPrimary) return -1;
          if (!a.isPrimary && b.isPrimary) return 1;
          return b.exercise.effectiveSets - a.exercise.effectiveSets;
        });

      if (!exercisesForGroup.length) continue;

      let cycle = 0;
      while (Math.abs(diff) > 0.25 && cycle < 50) {
        const exItem = exercisesForGroup[cycle % exercisesForGroup.length];
        const ex = exItem.exercise;
        const changeSign = Math.sign(diff);
        const setsChange = ex.isUnilateral ? 2 * changeSign : 1 * changeSign;

        if (ex.targetSets + setsChange < (ex.isUnilateral ? 2 : 1)) {
          cycle++;
          continue;
        }

        ex.targetSets += setsChange;

        const effectiveSetsAltered = ex.isUnilateral ? 1 : 1;
        let contribution = 0;
        if (exItem.isPrimary) {
          contribution = 1.0;
        } else if (exItem.isSecondary) {
          contribution = 0.5;
        }

        diff -= effectiveSetsAltered * contribution * changeSign;
        cycle++;
      }
    }

    newWorkoutPlan = {
      workouts: mutableWorkoutPlan.map((w: any) => ({
        name: w.name,
        exercises: w.exercises.map((e: any) => ({
          exerciseName: e.exerciseName,
          targetSets: e.targetSets,
        })),
      })),
    };
  }

  const aiGeneratedSets: { [key: string]: number } = {};
  for (const muscle of Object.values(MuscleGroup)) {
    aiGeneratedSets[muscle] = 0;
  }

  const addSetsToHierarchy = (
    muscle: MuscleGroup,
    sets: number,
    isUnilateral: boolean
  ) => {
    const effectiveSets = isUnilateral ? sets / 2 : sets;
    aiGeneratedSets[muscle] = (aiGeneratedSets[muscle] || 0) + effectiveSets;
    const parents = getMuscleGroupParents(muscle);
    for (const parent of parents) {
      aiGeneratedSets[parent] = (aiGeneratedSets[parent] || 0) + effectiveSets;
    }
  };

  for (const workout of newWorkoutPlan.workouts) {
    for (const exercise of workout.exercises) {
      const dbExercise = dbExercises.find(
        (e) => e.name === exercise.exerciseName
      );
      if (dbExercise) {
        const isUnilateral = dbExercise.default_unilateral;
        if (dbExercise.primaryMuscle) {
          addSetsToHierarchy(
            dbExercise.primaryMuscle,
            exercise.targetSets,
            isUnilateral
          );
        }
        if (dbExercise.secondaryMuscle) {
          for (const secondaryMuscle of dbExercise.secondaryMuscle) {
            addSetsToHierarchy(
              secondaryMuscle,
              exercise.targetSets * 0.5,
              isUnilateral
            );
          }
        }
      }
    }
  }

  console.log("\n--- AI vs. Suggested Sets ---");
  volumeAnalysis.forEach((v) => {
    const aiSets = aiGeneratedSets[v.muscleGroup] || 0;
    const suggestedSets = v.newSuggestedTotalSets;
    const diff = aiSets - suggestedSets;
  });

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const newMacroCycle = new MacroCycle();
    newMacroCycle.user = user;
    newMacroCycle.macroCycleName = generateMacroCycleName(referenceMacroCycle);

    const microcyclesCount =
      referenceMacroCycle.items?.length ||
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

    for (let i = 0; i < microcyclesCount; i++) {
      const newMicroCycle = new MicroCycle();
      newMicroCycle.user = user;
      newMicroCycle.microCycleName = generateMicroCycleName(
        referenceMacroCycle.items[0]?.microCycle,
        i + 1
      );
      newMicroCycle.trainingDays =
        referenceMacroCycle.items[0]?.microCycle.trainingDays ?? [];

      await queryRunner.manager.save(newMicroCycle);

      let workoutPosition = 0;
      for (const workoutData of newWorkoutPlan.workouts) {
        const newWorkout = new Workout();
        newWorkout.name = workoutData.name;
        await queryRunner.manager.save(newWorkout);

        let workoutExercisePosition = 0;
        for (const exerciseData of workoutData.exercises) {
          const exercise = dbExercises.find(
            (e) => e.name === exerciseData.exerciseName
          );
          if (!exercise) {
            throw new AppError(
              `Exercício "${exerciseData.exerciseName}" não foi encontrado no banco de dados.`
            );
          }

          const newWorkoutExercise = new WorkoutExercise();
          newWorkoutExercise.workout = newWorkout;
          newWorkoutExercise.exercise = exercise;
          newWorkoutExercise.targetSets = exerciseData.targetSets;
          newWorkoutExercise.position = workoutExercisePosition;
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

      const macroCycleItem = new MacroCycleItem();
      macroCycleItem.macroCycle = newMacroCycle;
      macroCycleItem.microCycle = newMicroCycle;
      await queryRunner.manager.save(macroCycleItem);
    }

    await queryRunner.commitTransaction();

    const savedMacroCycle = await queryRunner.manager.findOne(MacroCycle, {
      where: { id: newMacroCycle.id },
      relations: {
        items: {
          microCycle: {
            cycleItems: {
              workout: {
                workoutExercises: { exercise: true },
              },
            },
          },
        },
      },
    });

    if (!savedMacroCycle) {
      throw new AppError("Falha ao carregar o macro ciclo criado", 500);
    }

    return savedMacroCycle;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("Falha ao gerar um novo macro ciclo:", error);
    throw new AppError("Falha ao gerar um novo macro ciclo", 500);
  } finally {
    await queryRunner.release();
  }
};
