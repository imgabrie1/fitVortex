import { Request, Response } from "express";
import { addWorkoutsToMicroCycleService } from "../services/microCycle/addWorkoutsToMicroCycle.service";
import { createMicroCycleService } from "../services/microCycle/createMicroCycle.service";
import {
  iAddWorkoutsToMicroCycle,
  iCreateMicroCycle,
} from "../interfaces/microCycle.interface";
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
    startDate: micro.createdAt,
    trainingDays: micro.trainingDays,
    macroCycleId: micro.macroCycleId ?? null,
    user: { id: micro.userId }
  };

  const output = returnMicroCycleSchema.parse(safe);
  return res.status(201).json(output);
};


export const addWorkoutsToMicroCycleController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { microCycleId } = req.params;
  const workoutData: iAddWorkoutsToMicroCycle = req.body;
  const userId = req.user.id;

  const updatedMicroCycle = await addWorkoutsToMicroCycleService(
    microCycleId,
    workoutData,
    userId
  );

  return res.status(200).json(updatedMicroCycle);
};
