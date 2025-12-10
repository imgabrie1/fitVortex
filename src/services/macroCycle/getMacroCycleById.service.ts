import { AppDataSource } from "../../data-source";
import { MacroCycle } from "../../entities/macroCycle.entity";
import { AppError } from "../../errors";

export const getMacroCycleByIDService = async (
  macroCycleID: string,
  userID: string
): Promise<MacroCycle> => {
  const macroCycleRepository = AppDataSource.getRepository(MacroCycle);

  const macroCycle = await macroCycleRepository
    .createQueryBuilder("macroCycle")
    .leftJoinAndSelect("macroCycle.user", "user")
    .leftJoinAndSelect("macroCycle.volumes", "volumes")
    .leftJoinAndSelect("macroCycle.microCycles", "microCycle")
    .leftJoinAndSelect("microCycle.cycleItems", "cycleItems")
    .leftJoinAndSelect("cycleItems.workout", "workout")
    .leftJoinAndSelect("cycleItems.sets", "sets")
    .leftJoinAndSelect("sets.exercise", "exercise")
    .leftJoinAndSelect("workout.workoutExercises", "workoutExercises")
    .leftJoinAndSelect("workoutExercises.exercise", "workoutExercise")
    .where("macroCycle.id = :macroCycleID", { macroCycleID })
    .orderBy("microCycle.createdAt", "ASC")
    .getOne();

  if (!macroCycle) {
    throw new AppError("Macro ciclo não encontrado", 404);
  }

  if (macroCycle.user.id !== userID) {
    throw new AppError("Não autorizado", 403);
  }

  return macroCycle;
};
