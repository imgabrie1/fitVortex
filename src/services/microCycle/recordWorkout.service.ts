import { AppDataSource } from "../../data-source";
import { Exercise } from "../../entities/exercise.entity";
import { MicroCycleItem } from "../../entities/microCycleItem.entity";
import { Set } from "../../entities/set.entity";
import { AppError } from "../../errors";
import { TRecordWorkout } from "../../interfaces/set.interface";

export const recordWorkoutService = async (microCycleId: string, workoutId: string, payload: TRecordWorkout): Promise<MicroCycleItem> => {
    const microCycleItemRepository = AppDataSource.getRepository(MicroCycleItem);
    const exerciseRepository = AppDataSource.getRepository(Exercise);
    const setRepository = AppDataSource.getRepository(Set);

    const microCycleItem = await microCycleItemRepository.findOne({
        where: {
            microCycle: { id: microCycleId },
            workout: { id: workoutId },
        },
        relations: ["workout"],
    });

    if (!microCycleItem) {
        throw new AppError("Micro cycle item not found", 404);
    }

    await Promise.all(payload.exercises.map(async (exerciseData) => {
        const exercise = await exerciseRepository.findOne({ where: { id: exerciseData.exerciseId } });
        if (!exercise) {
            throw new AppError(`Exercise with ID ${exerciseData.exerciseId} not found`, 404);
        }

        const setsToCreate = exerciseData.sets.map(setData => {
            return setRepository.create({
                reps: setData.reps,
                weight: setData.weight,
                notes: setData.notes || null,
                microCycleItem,
                exercise,
            });
        });

        await setRepository.save(setsToCreate);
    }));

    const updatedMicroCycleItem = await microCycleItemRepository.findOne({
        where: { id: microCycleItem.id },
        relations: ["sets", "sets.exercise"],
    });

    if (!updatedMicroCycleItem) {
        throw new AppError("An error occurred while fetching the updated micro cycle item.", 500);
    }

    return updatedMicroCycleItem;
};