/*
  generateNextMacroCycle.service.ts
  - Reescrito para usar o SDK oficial @google/genai (Gemini)
  - Instalação: npm install @google/genai
  - Variáveis de ambiente necessárias:
      GEMINI_API_KEY (sua API key)
      GEMINI_MODEL (opcional, default: gemini-2.0-flash)

  Observações:
  - O SDK e o endpoint podem variar conforme a versão da biblioteca. Ajuste o `import`/instanciação
    caso sua versão do SDK exponha outra API.
  - O código valida o formato retornado pela IA antes de gravar no banco e faz rollback em falhas.
*/

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
import { MuscleGroup } from "../../enum/muscleGroup.enum";

interface IGenerateNextMacroCycle {
  macroCycleId: string;
  userId: string;
  prompt: string;
  createNewWorkout: boolean;
  maxSetsPerMicroCycle?: number;
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
  throw new AppError("A variável de ambiente GEMINI_API_KEY não está definida");
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
}: IGenerateNextMacroCycle): Promise<{
  macroCycle: MacroCycle;
  microCycle: MicroCycle;
}> => {
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
    throw new AppError("Macrociclo de referência não encontrado", 404);

  const microcyclesCount = referenceMacroCycle.items.length > 0 ? referenceMacroCycle.items.length : 1;

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
  }, microcyclesCount);

  const referenceMicroCycle = referenceMacroCycle.items[0].microCycle;
  const oldWorkoutPlan = referenceMicroCycle.cycleItems.map((ci) => ({
    name: ci.workout.name,
    exercises: ci.workout.workoutExercises.map((we) => ({
      exerciseName: we.exercise.name,
      targetSets: we.targetSets,
      primaryMuscle: we.exercise.primaryMuscle,
      secondaryMuscle: we.exercise.secondaryMuscle,
    })),
  }));

  const dbExercises = await exerciseRepo.find();
  const dbExerciseNames = dbExercises.map((e) => e.name).sort();


  const muscleLines = volumeAnalysis
    .map((v: any) => {
      const limitedSets = Math.min(
        v.newSuggestedTotalSets,
        maxSetsPerMicroCycle
      );
      return `- ${v.muscleGroup}: ${limitedSets} sets (máx ${maxSetsPerMicroCycle})`;
    })
    .join("\n");

  const aiPrompt = `You are an expert personal trainer. Your task is to create a new workout plan based on the user's progress and goals.

User's goal: "${prompt}"
Should create a new workout from scratch? ${createNewWorkout}

Based on the last macrocycle analysis, here are the new suggested total weekly sets for each muscle group:
${muscleLines}

This was the workout structure from the last microcycle:
${JSON.stringify(oldWorkoutPlan, null, 2)}

Available exercises in the database (use exactly these names when referencing exercises):
${dbExerciseNames.join(", ")}

General rules you must follow when building the plan:
- Total sets per microcycle for each muscle group cannot exceed ${maxSetsPerMicroCycle}.
- For **fullbody workouts**:
  * Include 2 exercises for the 2 main focus muscles (max 3 sets each).
  * Include 1 exercise per remaining muscle.
  * Large muscles should preferably get 4 sets, smaller ones 3.
  * Workouts should have 6–7 exercises.
  * Total sets per workout: 18–22 (not more).
- For **push/pull workouts**:
  * First focus muscle: ~50% of the workout volume with 3 exercises.
  * Second focus muscle: ~33% of the volume with 2 exercises.
  * Third focus muscle: ~16% of the volume with 1 exercise.
- These are guidelines, not strict rules. Prefer to respect them when possible.

Instructions:
1) Your response MUST be a JSON object following this exact structure: { "workouts": [ { "name": "Workout A", "exercises": [ { "exerciseName": "Bench Press", "targetSets": 4 } ] } ] }
2) The sum of the sets for each muscle group in your generated plan should match the suggested total weekly sets as closely as possible, while following the rules above.
3) If createNewWorkout is false, use the same exercises as the old plan, only adjusting the sets.
4) If createNewWorkout is true, you may suggest new exercises, but they MUST be in the available exercises list above.
5) Distribute the sets intelligently. If totals don't divide perfectly, approximate logically.

Return ONLY the JSON object (no explanation, no markdown fences).
`;

  let aiRawText: string | null = null;
  try {
    const model = DEFAULT_MODEL;

    const resp: any = await genai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: aiPrompt }] }],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 800,
        temperature: 0.2,
      },
    });

    aiRawText = 
      resp?.candidates?.[0]?.content?.[0]?.parts?.[0]?.text ??
      resp?.text ??
      null;
  } catch (err: any) {
    console.error("Gemini SDK error:", err?.response ?? err?.message ?? err);
    throw new AppError("Falha na requisição ao serviço de IA", 502);
  }

  if (!aiRawText) {
    throw new AppError("A IA não retornou texto utilizável", 502);
  }

  let newWorkoutPlan: IWorkoutPlan;
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
    console.error("Failed to parse AI JSON:", parseErr, "raw:", aiRawText);
    throw new AppError("Falha ao analisar o JSON da resposta da IA", 502);
  }

  if (!validateWorkoutPlan(newWorkoutPlan)) {
    console.error("AI returned invalid workout plan shape:", newWorkoutPlan);
    throw new AppError("A IA retornou um plano de treinos inválido", 502);
  }

  const aiGeneratedSets: { [key: string]: number } = {};
  for (const muscle of Object.values(MuscleGroup)) {
    aiGeneratedSets[muscle] = 0;
  }

  for (const workout of newWorkoutPlan.workouts) {
    for (const exercise of workout.exercises) {
      const dbExercise = dbExercises.find(
        (e) => e.name === exercise.exerciseName
      );
      if (dbExercise) {
        aiGeneratedSets[dbExercise.primaryMuscle] += exercise.targetSets;
        if (dbExercise.secondaryMuscle) {
          for (const secondaryMuscle of dbExercise.secondaryMuscle) {
            aiGeneratedSets[secondaryMuscle] += exercise.targetSets * 0.5;
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
    console.log(
      `${v.muscleGroup}: Suggested: ${suggestedSets}, AI: ${aiSets.toFixed(
        1
      )}, Diff: ${diff.toFixed(1)}`
    );
    if (Math.abs(diff) > 2) {
      console.warn(`Large discrepancy for ${v.muscleGroup}. Check AI logic.`);
    }
  });
  console.log("---------------------------\n");

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const newMacroCycle = new MacroCycle();
    newMacroCycle.user = user;

    const refMicroQuantity = (referenceMacroCycle as any).microQuantity;
    const microcyclesCount = 
      Array.isArray(referenceMacroCycle.items) &&
      referenceMacroCycle.items.length > 0
        ? referenceMacroCycle.items.length
        : typeof refMicroQuantity === "number"
        ? refMicroQuantity
        : 1;

    newMacroCycle.microQuantity = microcyclesCount;

    newMacroCycle.startDate = new Date().toISOString().split("T")[0];
    const duration = 
      new Date(referenceMacroCycle.endDate).getTime() -
      new Date(referenceMacroCycle.startDate).getTime();
    newMacroCycle.endDate = new Date(new Date().getTime() + duration)
      .toISOString()
      .split("T")[0];

    await queryRunner.manager.save(newMacroCycle);

    const newMicroCycle = new MicroCycle();
    newMicroCycle.user = user;
    newMicroCycle.trainingDays = referenceMicroCycle.trainingDays;
    await queryRunner.manager.save(newMicroCycle);

    for (const workoutData of newWorkoutPlan.workouts) {
      const newWorkout = new Workout();
      newWorkout.name = workoutData.name;
      await queryRunner.manager.save(newWorkout);

      for (const exerciseData of workoutData.exercises) {
        const exercise = dbExercises.find(
          (e) => e.name === exerciseData.exerciseName
        );
        if (!exercise) {
          throw new AppError(`Exercício "${exerciseData.exerciseName}" não encontrado no banco de dados.`);
        }

        const newWorkoutExercise = new WorkoutExercise();
        newWorkoutExercise.workout = newWorkout;
        newWorkoutExercise.exercise = exercise;
        newWorkoutExercise.targetSets = exerciseData.targetSets;
        await queryRunner.manager.save(newWorkoutExercise);
      }

      const microCycleItem = new MicroCycleItem();
      microCycleItem.microCycle = newMicroCycle;
      microCycleItem.workout = newWorkout;
      await queryRunner.manager.save(microCycleItem);
    }

    for (let i = 0; i < microcyclesCount; i++) {
      const macroCycleItem = new MacroCycleItem();
      macroCycleItem.macroCycle = newMacroCycle;
      macroCycleItem.microCycle = newMicroCycle;
      await queryRunner.manager.save(macroCycleItem);
    }

    await queryRunner.commitTransaction();

    let savedMicroCycle = await queryRunner.manager.findOne(MicroCycle, {
      where: { id: newMicroCycle.id },
      relations: {
        cycleItems: {
          workout: {
            workoutExercises: { exercise: true },
          },
        },
      },
    });

    if (
      !savedMicroCycle ||
      !Array.isArray(savedMicroCycle.cycleItems) ||
      savedMicroCycle.cycleItems.length === 0
    ) {
      const baseMicro = await queryRunner.manager.findOne(MicroCycle, {
        where: { id: newMicroCycle.id },
      });
      if (!baseMicro) {
        throw new AppError("Micro ciclo criado não encontrado", 500);
      }

      const fetchedItems = await queryRunner.manager.find(MicroCycleItem, {
        where: { microCycle: { id: newMicroCycle.id } as any },
        relations: {
          workout: {
            workoutExercises: { exercise: true },
          },
        },
        order: { id: "ASC" },
      });

      savedMicroCycle = {
        ...baseMicro,
        cycleItems: fetchedItems,
      } as MicroCycle;
    }

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

    if (!savedMicroCycle || !savedMacroCycle) {
      throw new AppError("Falha ao carregar o ciclo macro/micro criado", 500);
    }

    return { macroCycle: savedMacroCycle, microCycle: savedMicroCycle };
  } catch (error) {
    try {
      await queryRunner.rollbackTransaction();
    } catch (rbErr) {
      console.error("Rollback failed:", rbErr);
    }
    console.error("Failed to generate new macrocycle:", error);
    throw new AppError("Falha ao gerar um novo macro ciclo", 500);
  } finally {
    try {
      await queryRunner.release();
    } catch (relErr) {
      console.error("Failed to release query runner:", relErr);
    }
  }
};
