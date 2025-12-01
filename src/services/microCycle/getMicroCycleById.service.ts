import { AppDataSource } from "../../data-source";
import { MicroCycle } from "../../entities/microCycle.entity";
import { AppError } from "../../errors";

export const getMicroCycleByIDService = async (
  microCycleID: string,
  userID: string
): Promise<MicroCycle> => {
  const microCycleRepository = AppDataSource.getRepository(MicroCycle);

  const microCycle = await microCycleRepository.findOne({
    where: { id: microCycleID },
    relations: [
      "user",
      "cycleItems",
      "cycleItems.workout",
      "cycleItems.workout.workoutExercises",
      "cycleItems.workout.workoutExercises.exercise",
      "cycleItems.sets",
      "cycleItems.sets.exercise",
    ],
  });

  if (!microCycle) {
    throw new AppError("Micro ciclo não encontrado", 404);
  }

  if (microCycle.user.id !== userID) {
    throw new AppError("Não autorizado", 403);
  }

  return microCycle;
};
