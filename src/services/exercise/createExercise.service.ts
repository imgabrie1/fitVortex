import { AppDataSource } from "../../data-source";
import { Exercise } from "../../entities/exercise.entity";
import { iExercise, iExerciseReturn, iRepoExercise } from "../../interfaces/exercise.interface";
import { returnExerciseSchema } from "../../schemas/exercise.schema";

const createExerciseService = async (
  exerciseData: iExercise
): Promise<iExerciseReturn> => {
  const exerciseRepo: iRepoExercise = AppDataSource.getRepository(Exercise);

  const dataForCreate = {
    name: exerciseData.name,
    primaryMuscle: exerciseData.primaryMuscle,
    resistanceType: exerciseData.resistanceType,
    description: exerciseData.description ?? null,
    imageURL: exerciseData.imageURL ?? null,
    secondaryMuscle: exerciseData.secondaryMuscle ?? null,
  };

  const newExercise = exerciseRepo.create(dataForCreate);

  await exerciseRepo.save(newExercise);

  const returnExercise = returnExerciseSchema.parse(newExercise);

  return returnExercise;
};

export default createExerciseService;