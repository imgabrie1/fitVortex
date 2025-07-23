import { Request, Response } from "express";
import { recordWorkoutService } from "../services/microCycle/recordWorkout.service";

export const recordWorkoutController = async (req: Request, res: Response): Promise<Response> => {
    const { microCycleId, workoutId } = req.params;
    const workoutData = req.body;

    const updatedMicroCycleItem = await recordWorkoutService(microCycleId, workoutId, workoutData);

    return res.status(200).json(updatedMicroCycleItem);
};