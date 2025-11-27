import { Request, Response } from "express";
import { skipWorkoutService } from "../services/microCycle/skipWorkout.service";

export const skipWorkoutController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { microCycleID, workoutID } = req.params;

  const microCycleItem = await skipWorkoutService(microCycleID, workoutID);

  return res.status(200).json(microCycleItem);
};
