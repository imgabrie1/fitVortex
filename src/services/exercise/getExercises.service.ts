import { AppDataSource } from "../../data-source";
import { Exercise } from "../../entities/exercise.entity";
import { AppError } from "../../errors";

export const getExercisesService = async (): Promise<Exercise[]> => {
    const exercisesRepo = AppDataSource.getRepository(Exercise);

    const exercises = await exercisesRepo.find()

    if(!exercises){
        throw new AppError("exercício não encontrado", 404)
    }

    return exercises
}