import { Request, Response } from "express";
import { iWorkout } from "../interfaces/workout.interface";
import { createWorkoutService } from "../services/workout/createWorkout.service";
import { getAllUserWorkoutsService } from "../services/workout/getAllUserWorkouts.service";

export const createWorkoutController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const workoutData: iWorkout = req.body;

  const newWorkout = await createWorkoutService(workoutData);

  return res.status(201).json(newWorkout);
};

export const getAllUserWorkoutsController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const { id } = req;


  const result = await getAllUserWorkoutsService(page, limit, id);

  return res.status(200).json(result);
};
