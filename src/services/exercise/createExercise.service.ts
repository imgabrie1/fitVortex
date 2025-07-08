import { AppDataSource } from "../../data-source";
import { Exercise } from "../../entities/exercise.entity";
import { AppError } from "../../errors";
import { iRepoExercise, iExercise, iExerciseReturn } from "../../interfaces/exercise.interface";
import { exerciseSchema, returnExerciseSchema } from "../../schemas/exercise.schema";


const createExerciseService = async (data: iExercise): Promise<Exercise> => {
  const repoExercise: iRepoExercise = AppDataSource.getRepository(Exercise);
  const existingExercise = await repoExercise.findOne({
    where: {
      name: data.name,
    },
  });

  if (existingExercise) {
    throw new AppError("Exercício com esse nome já existe", 409);
  }

  const exercise = exerciseSchema.parse(data);

  const newExercise: Exercise = repoExercise.create(exercise);

  await repoExercise.save(newExercise);

  return newExercise;
};
export default createExerciseService;
