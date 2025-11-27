import { Request, Response } from "express";
import { editRecordedWorkoutService } from "../services/microCycle/editRecordedWorkout.service";

export const editRecordedWorkoutController = async (req: Request, res: Response): Promise<Response> => {
    const { microCycleID, workoutID } = req.params;
    const workoutData = req.body;

    const updatedMicroCycleItem = await editRecordedWorkoutService(microCycleID, workoutID, workoutData);

    return res.status(200).json(updatedMicroCycleItem);
};
