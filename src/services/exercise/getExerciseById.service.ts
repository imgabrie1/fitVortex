import { AppDataSource } from "../../data-source";
import { Exercise } from "../../entities/exercise.entity";
import { AppError } from "../../errors";

export const getExerciseByIDService = async (exerciseID: string): Promise<Exercise> => {
    const exerciseRepo = AppDataSource.getRepository(Exercise);

    const exercise = await exerciseRepo.findOne({
        where: {
            id: exerciseID
        }
    })

    if(!exercise){
        throw new AppError("exercício não encontrado", 404)
    }

    return exercise
}