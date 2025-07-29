import { AppDataSource } from "../../data-source";
import { Exercise } from "../../entities/exercise.entity";
import { MicroCycleItem } from "../../entities/microCycleItem.entity";
import { Set } from "../../entities/set.entity";
import { AppError } from "../../errors";
import { TRecordWorkout } from "../../interfaces/set.interface";

export const recordWorkoutService = async (microCycleID: string, workoutID: string, payload: TRecordWorkout): Promise<MicroCycleItem> => {
    const microCycleItemRepo = AppDataSource.getRepository(MicroCycleItem);
    const exerciseRepo = AppDataSource.getRepository(Exercise);
    const setRepo = AppDataSource.getRepository(Set);

    const microCycleItem = await microCycleItemRepo.findOne({
        where: {
            microCycle: { id: microCycleID },
            workout: { id: workoutID },
        },
        relations: ["workout"],
    });

    if (!microCycleItem) {
        throw new AppError("itens do micro ciclo não encontrados", 404);
    }

    await Promise.all(payload.exercises.map(async (exerciseData) => {
        const exercise = await exerciseRepo.findOne({ where: { id: exerciseData.exerciseID } });
        if (!exercise) {
            throw new AppError(`Exercício com ID ${exerciseData.exerciseID} não encontrado`, 404);
        }

        const setsToCreate = exerciseData.sets.map(setData => {
            return setRepo.create({
                reps: setData.reps,
                weight: setData.weight,
                notes: setData.notes || null,
                microCycleItem,
                exercise,
            });
        });

        await setRepo.save(setsToCreate);
    }));

    const updatedMicroCycleItem = await microCycleItemRepo.findOne({
        where: { id: microCycleItem.id },
        relations: ["sets", "sets.exercise"],
    });

    if (!updatedMicroCycleItem) {
        throw new AppError("ocorreu um erro ao tentar gravar o treino", 500);
    }

    return updatedMicroCycleItem;
};