import { Request, Response } from "express";
import { addWorkoutsToMicroCycleService } from "../services/microCycle/addWorkoutsToMicroCycle.service";
import { createMicroCycleService } from "../services/microCycle/createMicroCycle.service";
import { returnMicroCycleSchema } from "../schemas/microCycle.schema";


export const createMicroCycleController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const body = req.body;
  const userId = req.user!.id;

  const micro = await createMicroCycleService(body, userId);

  const safe = {
    id: micro.id,
    createdAt: micro.createdAt,
    trainingDays: micro.trainingDays,
    user: {
    id:    micro.user.id,
    name:  micro.user.name,
    email: micro.user.email,
  },
  };

  const output = returnMicroCycleSchema.parse(safe);
  return res.status(201).json(output);
};


export const addWorkoutsToMicroCycleController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { microCycleId, workoutId } = req.params;
  const userId = req.user.id;

  const updatedMicroCycle = await addWorkoutsToMicroCycleService(
    microCycleId,
    workoutId,
    userId
  );

  return res.status(200).json(updatedMicroCycle);
};