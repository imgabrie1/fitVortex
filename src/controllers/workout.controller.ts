import { Request, Response } from "express";
import { iWorkout } from "../interfaces/workout.interface";
import { createWorkoutService } from "../services/workout/createWorkout.service";

export const createWorkoutController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const workoutData: iWorkout = req.body;

  const newWorkout = await createWorkoutService(workoutData);

  return res.status(201).json(newWorkout);
};
