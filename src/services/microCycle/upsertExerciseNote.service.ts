import { AppDataSource } from "../../data-source";
import { MicroCycleItem } from "../../entities/microCycleItem.entity";
import { Exercise } from "../../entities/exercise.entity";
import { AppError } from "../../errors";

interface IUpsertNotePayload {
  exerciseId: string;
  notes: string | null;
}

export const upsertExerciseNoteService = async (
  microCycleId: string,
  workoutId: string,
  userID: string,
  payload: IUpsertNotePayload
): Promise<{ notesMap: Record<string, string> }> => {
  const itemRepo = AppDataSource.getRepository(MicroCycleItem);
  const exerciseRepo = AppDataSource.getRepository(Exercise);

  const exercise = await exerciseRepo.findOneBy({ id: payload.exerciseId });
  if (!exercise) throw new AppError("Exercício não encontrado", 404);

  const item = await itemRepo.findOne({
    where: {
      microCycle: { id: microCycleId },
      workout: { id: workoutId },
    },
    relations: ["microCycle", "microCycle.user"],
  });

  if (!item) throw new AppError("Item do microciclo não encontrado", 404);
  if (item.microCycle.user.id !== userID)
    throw new AppError("Não autorizado", 403);

  const currentMap = item.notesMap ?? {};
  if (payload.notes && payload.notes.trim() !== "") {
    currentMap[payload.exerciseId] = payload.notes.trim();
  } else {
    delete currentMap[payload.exerciseId];
  }

  item.notesMap = currentMap;
  await itemRepo.save(item);

  return { notesMap: currentMap };
};