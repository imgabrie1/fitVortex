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
  throw new AppError("GEMINI_API_KEY environment variable is not set");
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
}: IGenerateNextMacroCycle): Promise<MacroCycle> => {
  const macroCycleRepo = AppDataSource.getRepository(MacroCycle);
  const userRepo = AppDataSource.getRepository(User);
  const exerciseRepo = AppDataSource.getRepository(Exercise);

  const user = await userRepo.findOneBy({ id: userId });
  if (!user) throw new AppError("User not found", 404);

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
    throw new AppError("Reference macrocycle not found", 404);

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
    exercises: ci.workout.workoutExercises.map((we) => ({
      exerciseName: we.exercise.name,
      targetSets: we.targetSets,
      primaryMuscle: we.exercise.primaryMuscle,
      secondaryMuscle: we.exercise.secondaryMuscle,
    })),
  }));

  const dbExercises = await exerciseRepo.find();
  const exercisesForPrompt = dbExercises.map((e) => ({
    name: e.name,
    primaryMuscle: e.primaryMuscle,
    secondaryMuscles: e.secondaryMuscle,
  }));

  const analysisForPrompt = volumeAnalysis.map(
    ({ muscleGroup, newSuggestedTotalSets, suggestion, combinedChange }) => ({
      muscleGroup,
      newSuggestedTotalSets,
      suggestion,
      combinedChange: combinedChange.toFixed(2) + "%",
    })
  );

  const aiPrompt = `You are an expert personal trainer. Your task is to create a new workout plan based on
 the user\'s progress and goals.

    User's goal: "${prompt}"
    Should create a new workout from scratch? ${createNewWorkout}

    This is the detailed performance analysis from the last macrocycle. Use it to guide your decisions:
    ${JSON.stringify(analysisForPrompt, null, 2)}

    This was the workout structure from the last microcycle:
    ${JSON.stringify(oldWorkoutPlan, null, 2)}

    This is the complete list of available exercises from the database, with their target muscles. You MUST use
 this information to select the correct exercises:
    ${JSON.stringify(exercisesForPrompt, null, 2)}

    General rules you must follow when building the plan:
    - The total sets for each muscle group in your plan MUST match the 'newSuggestedTotalSets' from the analysis
 as closely as possible.
    - Total sets per microcycle for any single muscle group cannot exceed ${maxSetsPerMicroCycle}.

    **Intelligent Distribution Logic (VERY IMPORTANT):**
    - Look at the performance of subgroups. If a parent group's volume is 'maintain' (e.g., 'Peito (Total)'), but
 a subgroup 'increase'd (e.g., 'Peito Superior'), you should shift focus. Allocate more of the total sets to
 exercises for the improving subgroup.
    - Conversely, if a subgroup 'decrease'd, allocate fewer sets to it, redistributing them to subgroups that are
 stable or improving.
    - Use the 'combinedChange' percentage to gauge the magnitude of the trend. A large positive change warrants a
 more significant focus shift.
    - This rebalancing is a priority, but only if it fits within the total set counts and other rules.

    Instructions:
    1) Your response MUST be a JSON object following this exact structure: { "workouts": [ { "name": "Workout A",
 "exercises": [ { "exerciseName": "Bench Press", "targetSets": 4 } ] } ] }
    2) When selecting exercises, you MUST use the exact 'name' from the list of available exercises provided.
    3) If createNewWorkout is false, use the same exercises as the old plan, only adjusting the sets according to
 the analysis.
    4) If createNewWorkout is true, you may suggest new exercises, but they MUST be from the available exercises
 list.
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
    throw new AppError("AI service request failed", 502);
  }

  if (!aiRawText) {
    throw new AppError("AI returned no usable text", 502);
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
    throw new AppError("Failed to parse AI response JSON", 502);
  }

  if (!validateWorkoutPlan(newWorkoutPlan)) {
    console.error("AI returned invalid workout plan shape:", newWorkoutPlan);
    throw new AppError("AI returned invalid workout plan", 502);
  }

  const aiGeneratedSets: { [key: string]: number } = {};
  for (const muscle of Object.values(MuscleGroup)) {
    aiGeneratedSets[muscle] = 0;
  }

  // Helper para somar séries na hierarquia
  const addSetsToHierarchy = (muscle: MuscleGroup, sets: number) => {
    aiGeneratedSets[muscle] = (aiGeneratedSets[muscle] || 0) + sets;
    const parents = getMuscleGroupParents(muscle);
    for (const parent of parents) {
      aiGeneratedSets[parent] = (aiGeneratedSets[parent] || 0) + sets;
    }
  };

  for (const workout of newWorkoutPlan.workouts) {
    for (const exercise of workout.exercises) {
      const dbExercise = dbExercises.find(
        (e) => e.name === exercise.exerciseName
      );
      if (dbExercise) {
        if (dbExercise.primaryMuscle) {
          addSetsToHierarchy(dbExercise.primaryMuscle, exercise.targetSets);
        }
        if (dbExercise.secondaryMuscle) {
          for (const secondaryMuscle of dbExercise.secondaryMuscle) {
            addSetsToHierarchy(secondaryMuscle, exercise.targetSets * 0.5);
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
    // 1. Create the parent MacroCycle
    const newMacroCycle = new MacroCycle();
    newMacroCycle.user = user;
    newMacroCycle.macroCycleName = generateMacroCycleName(referenceMacroCycle);

    const microcyclesCount =
      referenceMacroCycle.items?.length || referenceMacroCycle.microQuantity || 1;

    newMacroCycle.microQuantity = microcyclesCount;
    newMacroCycle.startDate = new Date().toISOString().split("T")[0];
    const duration =
      new Date(referenceMacroCycle.endDate).getTime() -
      new Date(referenceMacroCycle.startDate).getTime();
    newMacroCycle.endDate = new Date(new Date().getTime() + duration)
      .toISOString()
      .split("T")[0];

    await queryRunner.manager.save(newMacroCycle);

    // 2. Loop to create each individual MicroCycle and its contents
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

      // Create all workouts and exercises for this new microcycle
      for (const workoutData of newWorkoutPlan.workouts) {
        const newWorkout = new Workout();
        newWorkout.name = workoutData.name;
        await queryRunner.manager.save(newWorkout);

        for (const exerciseData of workoutData.exercises) {
          const exercise = dbExercises.find(
            (e) => e.name === exerciseData.exerciseName
          );
          if (!exercise) {
            throw new AppError(
              `Exercise "${exerciseData.exerciseName}" not found in database.`
            );
          }

          const newWorkoutExercise = new WorkoutExercise();
          newWorkoutExercise.workout = newWorkout;
          newWorkoutExercise.exercise = exercise;
          newWorkoutExercise.targetSets = exerciseData.targetSets;
          await queryRunner.manager.save(newWorkoutExercise);
        }

        // Link the created workout to the current microcycle
        const microCycleItem = new MicroCycleItem();
        microCycleItem.microCycle = newMicroCycle;
        microCycleItem.workout = newWorkout;
        await queryRunner.manager.save(microCycleItem);
      }

      // Link the created microcycle to the parent macrocycle
      const macroCycleItem = new MacroCycleItem();
      macroCycleItem.macroCycle = newMacroCycle;
      macroCycleItem.microCycle = newMicroCycle;
      await queryRunner.manager.save(macroCycleItem);
    }

    await queryRunner.commitTransaction();

    // 3. Fetch and return the complete new MacroCycle
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
      throw new AppError("Failed to load created macro cycle", 500);
    }

    return savedMacroCycle;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("Failed to generate new macrocycle:", error);
    throw new AppError("Failed to generate new macrocycle", 500);
  } finally {
    await queryRunner.release();
  }
};
