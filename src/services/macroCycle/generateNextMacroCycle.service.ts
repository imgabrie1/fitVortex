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

/* ============================================================
   HELPERS — IA SAFE
============================================================ */

function extractSafeJson(text: string): string | null {
  if (!text) return null;
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;

  const candidate = text.slice(start, end + 1);
  try {
    JSON.parse(candidate);
    return candidate;
  } catch {
    return null;
  }
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

async function generateWorkoutPlanWithRetry(
  genai: GoogleGenAI,
  model: string,
  prompt: string,
  attempts = 2
): Promise<IWorkoutPlan> {
  let lastRaw: string | null = null;

  for (let i = 0; i < attempts; i++) {
    const resp: any = await genai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 3000,
        temperature: 0.2,
      },
    });

    const raw =
      resp?.candidates?.[0]?.content?.parts
        ?.filter((p: any) => "text" in p)
        ?.map((p: any) => p.text)
        ?.join("") ??
      resp?.text ??
      null;

    lastRaw = raw;

    if (!raw) continue;

    const cleaned = raw.replace(/```json|```/g, "").trim();
    const extracted = extractSafeJson(cleaned);
    if (!extracted) continue;

    try {
      const parsed = JSON.parse(extracted);
      if (validateWorkoutPlan(parsed)) {
        return parsed;
      }
    } catch {
      continue;
    }
  }

  console.error("IA retornou JSON inválido:", lastRaw);
  throw new AppError("IA falhou ao gerar um plano de treino válido", 502);
}

/* ============================================================
   CONFIG
============================================================ */

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new AppError("GEMINI_API_KEY env não existe");
}

const genai = new GoogleGenAI({ apiKey });
const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

/* ============================================================
   SERVICE
============================================================ */

interface IGenerateNextMacroCycle {
  macroCycleId: string;
  userId: string;
  prompt: string;
  createNewWorkout: boolean;
  maxSetsPerMicroCycle?: number;
  legPriority?: "Quadríceps (Total)" | "Posterior de Coxa (Total)";
}

export const generateNextMacroCycleService = async ({
  macroCycleId,
  userId,
  prompt,
  createNewWorkout,
  maxSetsPerMicroCycle = 24,
  legPriority = "Quadríceps (Total)",
}: IGenerateNextMacroCycle): Promise<IMacroCycle> => {
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
  });

  if (!referenceMacroCycle) {
    throw new AppError("Macro ciclo de referência não encontrado", 404);
  }

  const volumeAnalysis = await adjustVolumeService(macroCycleId, userId, {
    weights: {
      firstVsLast: 0.6,
      weeklyAverage: 0.4,
    },
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

  const referenceMicroCycle = referenceMacroCycle.microCycles[0];
  const oldWorkoutPlan = referenceMicroCycle.cycleItems.map((ci) => ({
    name: ci.workout.name,
    exercises: ci.workout.workoutExercises.map((we) => ({
      exerciseName: we.exercise.name,
      targetSets: we.targetSets,
      primaryMuscle: we.exercise.primaryMuscle,
      secondaryMuscle: we.exercise.secondaryMuscle,
      isUnilateral: we.is_unilateral,
    })),
  }));

  const dbExercises = await exerciseRepo.find();
  const exercisesForPrompt = dbExercises.map((e) => ({
    name: e.name,
    primaryMuscle: e.primaryMuscle,
    secondaryMuscles: e.secondaryMuscle,
    default_unilateral: e.default_unilateral,
  }));

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
    const aiPrompt = `
Crie um plano de treino baseado nos dados abaixo.

OBJETIVO:
"${prompt}"

EXERCÍCIOS DISPONÍVEIS:
${JSON.stringify(exercisesForPrompt)}

REGRAS:
- Use SOMENTE exercícios da lista
- Mínimo 2 séries por exercício
- Máximo ${maxSetsPerMicroCycle} séries por grupo muscular
- Responda APENAS JSON válido
- Se não conseguir completar o JSON, NÃO RESPONDA

FORMATO:
{
  "workouts": [
    {
      "name": "Nome do Treino",
      "exercises": [
        {
          "exerciseName": "Nome Exato",
          "targetSets": 4
        }
      ]
    }
  ]
}
`;

    const newWorkoutPlan = await generateWorkoutPlanWithRetry(
      genai,
      DEFAULT_MODEL,
      aiPrompt,
      2
    );

    finalPlan = {
      workouts: newWorkoutPlan.workouts.map((w) => ({
        name: w.name,
        exercises: w.exercises.map((e) => {
          const dbEx = dbExercises.find((x) => x.name === e.exerciseName);
          return {
            exerciseName: e.exerciseName,
            targetSets: Math.max(2, e.targetSets),
            isUnilateral: dbEx?.default_unilateral ?? false,
          };
        }),
      })),
    };
  } else {
    finalPlan = {
      workouts: oldWorkoutPlan.map((w) => ({
        name: w.name,
        exercises: w.exercises.map((e) => ({
          exerciseName: e.exerciseName,
          targetSets: e.targetSets,
          isUnilateral: e.isUnilateral,
        })),
      })),
    };
  }

  /* ============================================================
     PERSISTÊNCIA (INALTERADA)
  ============================================================ */

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const newMacroCycle = new MacroCycle();
    newMacroCycle.user = user;
    newMacroCycle.macroCycleName = `${referenceMacroCycle.macroCycleName} — próximo`;
    newMacroCycle.startDate = new Date().toISOString().split("T")[0]; // Set current date
    newMacroCycle.microQuantity = referenceMacroCycle.microCycles.length;

    const startDateObj = new Date(newMacroCycle.startDate);
    startDateObj.setDate(
      startDateObj.getDate() + newMacroCycle.microQuantity * 7 - 1
    );
    newMacroCycle.endDate = startDateObj.toISOString().split("T")[0];

    await queryRunner.manager.save(newMacroCycle);

    for (let i = 0; i < referenceMacroCycle.microCycles.length; i++) {
      const newMicro = new MicroCycle();
      newMicro.user = user;
      newMicro.macroCycle = newMacroCycle;
      newMicro.microCycleName = `${referenceMacroCycle.microCycles[i].microCycleName}`;

      await queryRunner.manager.save(newMicro);

      let pos = 0;
      for (const w of finalPlan.workouts) {
        const workout = new Workout();
        workout.name = w.name;
        await queryRunner.manager.save(workout);

        let exPos = 0;
        for (const e of w.exercises) {
          const dbEx = dbExercises.find((x) => x.name === e.exerciseName);
          if (!dbEx) {
            throw new AppError(`Exercício "${e.exerciseName}" não encontrado`);
          }

          const we = new WorkoutExercise();
          we.workout = workout;
          we.exercise = dbEx;
          we.targetSets = e.targetSets;
          we.position = exPos;
          we.is_unilateral = e.isUnilateral;

          await queryRunner.manager.save(we);
          exPos++;
        }

        const mci = new MicroCycleItem();
        mci.microCycle = newMicro;
        mci.workout = workout;
        mci.position = pos;

        await queryRunner.manager.save(mci);
        pos++;
      }
    }

    await queryRunner.commitTransaction();

    const saved = await macroCycleRepo.findOne({
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

    if (!saved) {
      throw new AppError("Falha ao carregar macro ciclo", 500);
    }

    // Convert date strings to Date objects before formatting
    const formattedSaved = {
      ...saved,
      startDate: formatDateToDDMMYYYY(new Date(saved.startDate)),
      endDate: formatDateToDDMMYYYY(new Date(saved.endDate)),
    };

    return formattedSaved;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    console.error(err);
    throw new AppError("Falha ao gerar novo macro ciclo", 500);
  } finally {
    await queryRunner.release();
  }
};
