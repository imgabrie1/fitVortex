import { AppDataSource } from "../../data-source"
import { Exercise } from "../../entities/exercise.entity"
import { AppError } from "../../errors"
import { iExerciseReturn } from "../../interfaces/exercise.interface"
import { returnExerciseSchema } from "../../schemas/exercise.schema"

const patchExerciseService = async (updatedData: Partial<Exercise>, exerciseID: string): Promise<iExerciseReturn> => {
    const exerciseRepo = AppDataSource.getRepository(Exercise)

    const oldExercise = await exerciseRepo.findOne({
        where: {id: exerciseID}
    })

    if(!oldExercise){
        throw new AppError("Exercício não encontrado", 404)
    }

    const updatedExercise = exerciseRepo.create({
        ...oldExercise,
        ...updatedData
    })

    await exerciseRepo.save(updatedExercise)

    return returnExerciseSchema.parse(updatedExercise)

}

export default patchExerciseService