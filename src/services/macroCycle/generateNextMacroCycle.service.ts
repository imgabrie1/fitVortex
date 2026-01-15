import { AppDataSource } from "../../data-source";
import { MacroCycle } from "../../entities/macroCycle.entity";
import { AppError } from "../../errors";
import { adjustVolumeService } from "./adjustVolume.service";
import { User } from "../../entities/user.entity";
import { MicroCycle } from "../../entities/microCycle.entity";
import { Workout } from "../../entities/workout.entity";
import { WorkoutExercise } from "../../entities/workoutExercise.entity";
import { Exercise } from "../../entities/exercise.entity";
import { MicroCycleItem } from "../../entities/microCycleItem.entity";
import { IMacroCycle } from "../../interfaces/macroCycle.interface";
import { formatDateToDDMMYYYY } from "../../utils/formatDate";
import { GoogleGenAI } from "@google/genai";
import {
  MuscleGroup,
  getMuscleGroupParents,
} from "../../enum/muscleGroup.enum";

const generateMacroCycleName = (ref?: any) =>
  ref?.macroCycleName
    ? `${ref.macroCycleName} — próximo`
    : `Macrocycle ${new Date().toISOString().split("T")[0]}`;

const generateMicroCycleName = (refMicro?: any, idx = 1) => {
  if (refMicro?.microCycleName) {
    const baseName = refMicro.microCycleName.replace(/\s+\d+$/, "").trim();
    return `${baseName} ${idx}`;
  }
  return `Microcycle ${new Date().toISOString().split("T")[0]} #${idx}`;
};

interface IGenerateNextMacroCycle {
  macroCycleId: string;
  userId: string;
  createNewWorkout: boolean;
  modifications?: Array<{
    workoutName: string;
    action: "replace" | "remove" | "add";
    fromExercise?: string;
    toExercise?: string;
    targetSets?: number;
  }>;
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
const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

// Timeout configurável para chamadas de IA (em segundos)
const AI_TIMEOUT_MS = 45000; // 45 segundos

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

function safelyParseAIResponse(text: string): IWorkoutPlan | null {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Nenhum JSON encontrado na resposta da IA");
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);
    if (validateWorkoutPlan(parsed)) {
      return parsed;
    } else {
      console.error("JSON inválido após parse:", parsed);
      return null;
    }
  } catch (error) {
    console.error("Erro ao fazer parse da resposta da IA:", error);
    return null;
  }
}

// Função para criar um timeout Promise
const createTimeoutPromise = (ms: number, message: string) => {
  return new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`TIMEOUT: ${message}`)), ms);
  });
};

// Função wrapper para chamada da IA com timeout
const callAIWithTimeout = async (
  prompt: string,
  timeoutMs: number
): Promise<string> => {
  const model = DEFAULT_MODEL;

  const aiPromise = (async () => {
    const resp: any = await genai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 4000,
        temperature: 0.2,
      },
    });

    if (resp.candidates && resp.candidates[0].content.parts) {
      return resp.candidates[0].content.parts
        .filter((part: any) => "text" in part)
        .map((part: any) => part.text)
        .join("");
    } else {
      return resp.text;
    }
  })();

  return Promise.race([
    aiPromise,
    createTimeoutPromise(
      timeoutMs,
      `Chamada da IA excedeu ${timeoutMs / 1000} segundos`
    ),
  ]);
};

// Função para aplicar modificações manuais ao plano de treino
function applyManualModifications(
  workoutPlan: any[],
  modifications: IGenerateNextMacroCycle["modifications"],
  allExercises: Exercise[]
): any[] {
  if (!modifications || modifications.length === 0) {
    return workoutPlan;
  }

  const modifiedPlan = JSON.parse(JSON.stringify(workoutPlan));

  for (const mod of modifications) {
    const workout = modifiedPlan.find(
      (w: any) => w.name.toLowerCase() === mod.workoutName.toLowerCase()
    );

    if (!workout) {
      console.warn(
        `Workout "${mod.workoutName}" não encontrado para modificação`
      );
      continue;
    }

    switch (mod.action) {
      case "replace":
        if (!mod.fromExercise || !mod.toExercise) {
          console.warn(
            "Modificação 'replace' requer fromExercise e toExercise"
          );
          continue;
        }

        // Verificar se exercício existe
        const fromExists = allExercises.some(
          (e) => e.name === mod.fromExercise
        );
        const toExists = allExercises.some((e) => e.name === mod.toExercise);

        if (!fromExists) {
          console.warn(
            `Exercício "${mod.fromExercise}" não encontrado no banco`
          );
          continue;
        }
        if (!toExists) {
          console.warn(`Exercício "${mod.toExercise}" não encontrado no banco`);
          continue;
        }

        // Encontrar e substituir
        const exerciseIndex = workout.exercises.findIndex(
          (e: any) => e.exerciseName === mod.fromExercise
        );

        if (exerciseIndex !== -1) {
          console.log(
            `Substituindo "${mod.fromExercise}" por "${mod.toExercise}" no workout "${mod.workoutName}"`
          );
          workout.exercises[exerciseIndex].exerciseName = mod.toExercise;
        } else {
          console.warn(
            `Exercício "${mod.fromExercise}" não encontrado no workout "${mod.workoutName}"`
          );
        }
        break;

      case "remove":
        if (!mod.fromExercise) {
          console.warn("Modificação 'remove' requer fromExercise");
          continue;
        }

        const removeIndex = workout.exercises.findIndex(
          (e: any) => e.exerciseName === mod.fromExercise
        );

        if (removeIndex !== -1) {
          console.log(
            `Removendo "${mod.fromExercise}" do workout "${mod.workoutName}"`
          );
          workout.exercises.splice(removeIndex, 1);
        } else {
          console.warn(
            `Exercício "${mod.fromExercise}" não encontrado no workout "${mod.workoutName}"`
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

        // Verificar se já existe
        const alreadyExists = workout.exercises.some(
          (e: any) => e.exerciseName === mod.toExercise
        );

        if (!alreadyExists) {
          console.log(
            `Adicionando "${mod.toExercise}" ao workout "${mod.workoutName}"`
          );
          workout.exercises.push({
            exerciseName: mod.toExercise,
            targetSets: mod.targetSets || 3, // Default 3 séries
            isUnilateral:
              allExercises.find((e) => e.name === mod.toExercise)
                ?.default_unilateral || false,
          });
        } else {
          console.warn(
            `Exercício "${mod.toExercise}" já existe no workout "${mod.workoutName}"`
          );
        }
        break;
    }
  }

  return modifiedPlan;
}

export const generateNextMacroCycleService = async ({
  macroCycleId,
  userId,
  createNewWorkout,
  modifications,
  maxSetsPerMicroCycle = 24,
  legPriority = "Quadríceps (Total)",
}: IGenerateNextMacroCycle): Promise<IMacroCycle> => {
  // Validação: modifications só funciona com createNewWorkout: true
  if (modifications && !createNewWorkout) {
    throw new AppError(
      "Modifications só pode ser usado com createNewWorkout: true",
      400
    );
  }

  const macroCycleRepo = AppDataSource.getRepository(MacroCycle);
  const userRepo = AppDataSource.getRepository(User);
  const exerciseRepo = AppDataSource.getRepository(Exercise);

  const user = await userRepo.findOneBy({ id: userId });
  if (!user) throw new AppError("Usuário não encontrado", 404);

  // Carregar apenas o PRIMEIRO microciclo como referência
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

  // Obter análise de volume ajustado (SEMPRE fazemos isso)
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

  // Usar apenas o PRIMEIRO microciclo como referência para IA
  const referenceMicroCycle = referenceMacroCycle.microCycles[0];
  if (!referenceMicroCycle) {
    throw new AppError(
      "Nenhum microciclo encontrado no macro ciclo de referência",
      404
    );
  }

  // Preparar o plano de treino do PRIMEIRO microciclo apenas
  const oldWorkoutPlan = referenceMicroCycle.cycleItems.map((ci) => ({
    name: ci.workout.name,
    exercises: ci.workout.workoutExercises.map((we) => {
      const isUnilateral = we.is_unilateral;
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

  // Buscar todos os exercícios do banco
  const allExercises = await exerciseRepo.find();

  // 1. FILTRAR EXERCÍCIOS: Pegar apenas músculos ativos da análise de volume
  const activeMuscles = volumeAnalysis.map((v) => v.muscleGroup);

  // Criar lista de músculos relevantes (incluindo pais na hierarquia)
  const relevantMuscles = new Set<MuscleGroup>();
  activeMuscles.forEach((muscle) => {
    relevantMuscles.add(muscle);
    getMuscleGroupParents(muscle).forEach((parent) =>
      relevantMuscles.add(parent)
    );
  });

  // Filtrar exercícios que trabalham músculos relevantes
  const relevantExercises = allExercises.filter(
    (e) =>
      relevantMuscles.has(e.primaryMuscle) ||
      e.secondaryMuscle?.some((s) => relevantMuscles.has(s))
  );

  // Se não houver exercícios relevantes, usar todos (fallback)
  const exercisesForPrompt = (
    relevantExercises.length > 0 ? relevantExercises : allExercises
  ).map((e) => ({
    name: e.name,
    primaryMuscle: e.primaryMuscle,
    secondaryMuscles: e.secondaryMuscle,
    default_unilateral: e.default_unilateral,
  }));

  const analysisForPrompt = volumeAnalysis.map(
    ({ muscleGroup, newSuggestedTotalSets, suggestion, combinedChange }) => ({
      muscleGroup,
      newSuggestedTotalSets: Math.round(newSuggestedTotalSets * 10) / 10,
      suggestion,
      combinedChange: combinedChange.toFixed(2) + "%",
    })
  );

  const unilateralLookup = new Map<string, boolean>();
  oldWorkoutPlan.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      if (!unilateralLookup.has(exercise.exerciseName)) {
        unilateralLookup.set(exercise.exerciseName, exercise.isUnilateral);
      }
    });
  });

  let finalPlan: {
    workouts: {
      name: string;
      exercises: {
        exerciseName: string;
        targetSets: number;
        isUnilateral: boolean;
      }[];
    }[];
  };

  if (createNewWorkout) {
    // APLICAR MODIFICAÇÕES MANUAIS ANTES DE ENVIAR PARA IA
    let workoutPlanForAI = JSON.parse(JSON.stringify(oldWorkoutPlan));

    if (modifications && modifications.length > 0) {
      console.log("Aplicando modificações manuais antes de enviar para IA:");
      workoutPlanForAI = applyManualModifications(
        workoutPlanForAI,
        modifications,
        allExercises
      );
    }

    // OTIMIZAÇÃO: IA processa apenas UM template com prompt otimizado
    const aiPrompt = `Você é um especialista em periodização. Crie um plano de treino otimizado.

PRIORIDADE DE PERNAS: ${
      legPriority === "Quadríceps (Total)"
        ? "Quadríceps 60% / Posterior 40%"
        : "Posterior 60% / Quadríceps 40%"
    }

ANÁLISE DE VOLUME (AJUSTE COM BASE NISSO - PRIORIDADE MÁXIMA):
${JSON.stringify(analysisForPrompt, null, 2)}

ESTRUTURA BASE (treino atual - mantenha nomes dos workouts):
${JSON.stringify(
  workoutPlanForAI.map((w: any) => ({
    name: w.name,
    exercises: w.exercises.map((e: any) => ({
      exerciseName: e.exerciseName,
      targetSets: e.targetSets,
    })),
  })),
  null,
  2
)}

EXERCÍCIOS DISPONÍVEIS (use APENAS estes):
${JSON.stringify(exercisesForPrompt.slice(0, 60), null, 2)} ${
      exercisesForPrompt.length > 60
        ? `\n... (+${exercisesForPrompt.length - 60} mais)`
        : ""
    }

--- REGRAS CRÍTICAS ---

1. VOLUME PRINCIPAL:
   - Aproxime-se ao máximo dos 'newSuggestedTotalSets' (prioridade máxima)
   - Mínimo 2 séries, máximo 6 séries por exercício
   - Exercícios unilaterais (default_unilateral: true) contam metade no volume

2. MANTENHA ESTRUTURA:
   - Não altere os nomes dos workouts
   - Mantenha aproximadamente o mesmo número de exercícios por workout
   - Você PODE substituir/adicionar/remover exercícios para atingir volumes ideais

3. DISTRIBUIÇÃO INTELIGENTE:
   - Não concentre muito volume em um único workout
   - Distribua músculos ao longo da semana
   - Considere recuperação muscular entre workouts

4. ALVO DE SÉRIES:
   - Total máximo: ${maxSetsPerMicroCycle} séries por microciclo
   - Por workout: 4-8 exercícios, 12-24 séries

OBJETIVO: Otimizar distribuição de volume mantendo estrutura similar.

RESPONDA APENAS JSON VÁLIDO:
{
  "workouts": [
    {
      "name": "segunda",
      "exercises": [
        {"exerciseName": "Nome Exato do Exercício", "targetSets": 3}
      ]
    }
  ]
}`;

    let aiResponse: IWorkoutPlan | null = null;
    let aiFallbackUsed = false;

    try {
      console.log(
        `Chamando IA com timeout de ${AI_TIMEOUT_MS / 1000} segundos...`
      );
      const aiRawText = await callAIWithTimeout(aiPrompt, AI_TIMEOUT_MS);

      console.log(
        "Resposta da IA recebida, tamanho:",
        aiRawText.length,
        "chars"
      );
      console.log("Primeiros 300 chars:", aiRawText.substring(0, 300));

      aiResponse = safelyParseAIResponse(aiRawText);

      if (!aiResponse) {
        console.warn("Resposta inválida da IA, usando fallback");
        aiFallbackUsed = true;
      } else {
        console.log(
          "IA retornou plano válido com",
          aiResponse.workouts.length,
          "workouts"
        );
      }
    } catch (err: any) {
      if (err.message?.startsWith("TIMEOUT:")) {
        console.error("Timeout na chamada da IA:", err.message);
        console.warn("Usando fallback devido a timeout");
      } else {
        console.error(
          "Erro na chamada da IA:",
          err?.response ?? err?.message ?? err
        );
        console.warn("Usando fallback devido a erro");
      }
      aiFallbackUsed = true;
    }

    if (aiFallbackUsed || !aiResponse) {
      // FALLBACK: Usar método de ajuste de volume (sem IA) APÓS modificações
      console.log(
        "Usando fallback: ajuste de volume sem IA (com modificações aplicadas)"
      );

      const volumeLedger: { [key in MuscleGroup]?: number } = {};
      volumeAnalysis.forEach((v) => {
        volumeLedger[v.muscleGroup] = v.newSuggestedTotalSets;
      });

      // Usar workoutPlanForAI que já tem as modificações aplicadas
      const mutableWorkoutPlan = JSON.parse(JSON.stringify(workoutPlanForAI));

      const postAiSetsCount: { [key: string]: number } = {};
      Object.values(MuscleGroup).forEach((m) => (postAiSetsCount[m] = 0));

      const addSetsToCount = (
        muscle: MuscleGroup,
        sets: number,
        isUnilateral: boolean,
        multiplier: number
      ) => {
        const effectiveSets = (isUnilateral ? sets / 2 : sets) * multiplier;
        postAiSetsCount[muscle] =
          (postAiSetsCount[muscle] || 0) + effectiveSets;
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
        while (Math.abs(diff) > 0.25 && cycle < 100) {
          const exItem = exercisesForGroup[cycle % exercisesForGroup.length];
          const ex = exItem.exercise;
          const changeSign = Math.sign(diff);
          const setsChange = ex.isUnilateral ? 2 * changeSign : 1 * changeSign;

          if (ex.targetSets + setsChange < 2) {
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

      finalPlan = {
        workouts: mutableWorkoutPlan.map((w: any) => ({
          name: w.name,
          exercises: w.exercises.map((e: any) => ({
            exerciseName: e.exerciseName,
            targetSets: Math.max(2, Math.min(e.targetSets, 6)), // 2-6 séries
            isUnilateral: e.isUnilateral,
          })),
        })),
      };
    } else {
      // Usar resposta da IA
      console.log("Processando resposta da IA...");

      finalPlan = {
        workouts: aiResponse.workouts.map((workout) => ({
          name: workout.name,
          exercises: workout.exercises.map((exercise) => {
            const dbExercise = allExercises.find(
              (e) => e.name === exercise.exerciseName
            );
            const isUnilateral =
              unilateralLookup.get(exercise.exerciseName) ??
              dbExercise?.default_unilateral ??
              false;

            // Garantir mínimo de 2 séries, máximo 6
            const targetSets = Math.max(2, Math.min(exercise.targetSets, 6));

            return {
              ...exercise,
              targetSets,
              isUnilateral,
            };
          }),
        })),
      };
    }
  } else {
    // Método sem IA (apenas ajuste de volume) - NÃO aplica modifications
    console.log("Usando método sem IA (ajuste de volume apenas)");

    const volumeLedger: { [key in MuscleGroup]?: number } = {};
    volumeAnalysis.forEach((v) => {
      volumeLedger[v.muscleGroup] = v.newSuggestedTotalSets;
    });

    const mutableWorkoutPlan = JSON.parse(JSON.stringify(oldWorkoutPlan));

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
      while (Math.abs(diff) > 0.25 && cycle < 100) {
        const exItem = exercisesForGroup[cycle % exercisesForGroup.length];
        const ex = exItem.exercise;
        const changeSign = Math.sign(diff);
        const setsChange = ex.isUnilateral ? 2 * changeSign : 1 * changeSign;

        if (ex.targetSets + setsChange < 2) {
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

    finalPlan = {
      workouts: mutableWorkoutPlan.map((w: any) => ({
        name: w.name,
        exercises: w.exercises.map((e: any) => ({
          exerciseName: e.exerciseName,
          targetSets: Math.max(2, Math.min(e.targetSets, 6)),
          isUnilateral: e.isUnilateral,
        })),
      })),
    };
  }

  // Calcular volumes gerados para logging
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

  for (const workout of finalPlan.workouts) {
    for (const exercise of workout.exercises) {
      const dbExercise = allExercises.find(
        (e) => e.name === exercise.exerciseName
      );
      if (dbExercise) {
        const isUnilateral = exercise.isUnilateral;
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

  console.log("\n--- Volumes Gerados vs. Sugeridos ---");
  volumeAnalysis.forEach((v) => {
    const aiSets = aiGeneratedSets[v.muscleGroup] || 0;
    const suggestedSets = v.newSuggestedTotalSets;
    const originalSets = v.totalSets;
    const diffSugerido = aiSets - suggestedSets;
    const diffOriginal = aiSets - originalSets;
    console.log(
      `- ${v.muscleGroup}: Antes ${originalSets.toFixed(
        2
      )}, Sugerido ${suggestedSets.toFixed(2)}, Gerado ${aiSets.toFixed(
        2
      )} (Diferença Sugerido: ${diffSugerido.toFixed(
        2
      )}, Diferença Original: ${diffOriginal.toFixed(2)})`
    );
  });

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const newMacroCycle = new MacroCycle();
    newMacroCycle.user = user;
    newMacroCycle.macroCycleName = generateMacroCycleName(referenceMacroCycle);

    // OTIMIZAÇÃO: Replicar template para N microciclos
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

    // REPLICAR template para cada microciclo
    for (let i = 0; i < microcyclesCount; i++) {
      const newMicroCycle = new MicroCycle();
      newMicroCycle.user = user;
      newMicroCycle.macroCycle = newMacroCycle;
      newMicroCycle.microCycleName = generateMicroCycleName(
        referenceMicroCycle,
        i + 1
      );
      newMicroCycle.trainingDays = referenceMicroCycle.trainingDays ?? [];

      await queryRunner.manager.save(newMicroCycle);
      newMacroCycle.microCycles.push(newMicroCycle);

      // Usar o MESMO template (finalPlan) para todos os microciclos
      let workoutPosition = 0;
      for (const workoutData of finalPlan.workouts) {
        const newWorkout = new Workout();
        newWorkout.name = workoutData.name;
        await queryRunner.manager.save(newWorkout);

        let workoutExercisePosition = 0;
        for (const exerciseData of workoutData.exercises) {
          const exercise = allExercises.find(
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
          newWorkoutExercise.is_unilateral = exerciseData.isUnilateral;
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

    if (!savedMacroCycle) {
      throw new AppError("Falha ao carregar o macro ciclo criado", 500);
    }

    const response: IMacroCycle = {
      ...savedMacroCycle,
      startDate: formatDateToDDMMYYYY(savedMacroCycle.startDate),
      endDate: formatDateToDDMMYYYY(savedMacroCycle.endDate),
    };

    console.log(
      `✅ Macro ciclo criado com ${microcyclesCount} microciclos idênticos`
    );
    return response;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("❌ Falha ao gerar um novo macro ciclo:", error);
    throw new AppError("Falha ao gerar um novo macro ciclo", 500);
  } finally {
    await queryRunner.release();
  }
};
