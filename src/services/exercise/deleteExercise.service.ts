import { AppDataSource } from "../../data-source";
import { Exercise } from "../../entities/exercise.entity";
import { AppError } from "../../errors";

const deleteExerciseService = async (exerciseID: string) => {
  const exerciseRepo = AppDataSource.getRepository(Exercise);

  const exercise = await exerciseRepo.findOne({ where: { id: exerciseID } });
  if (!exercise) {
    throw new AppError("Exercício não encontrado", 404);
  }

  await exerciseRepo.delete(exercise.id);

  return { message: "Exercício removido com sucesso" };
};

export default deleteExerciseService;
