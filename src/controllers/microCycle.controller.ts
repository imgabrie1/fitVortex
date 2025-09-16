import { Request, Response } from "express";
import { addWorkoutsToMicroCycleService } from "../services/microCycle/addWorkoutsToMicroCycle.service";
import { createMicroCycleService } from "../services/microCycle/createMicroCycle.service";
import { returnMicroCycleSchema } from "../schemas/microCycle.schema";
import { deleteMicroCycleService } from "../services/microCycle/deleteMicroCycle.service";
import { getMicroCycleByIDService } from "../services/microCycle/getMicroCycleById.service";

export const createMicroCycleController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const body = req.body;
  const userID = req.id;

  const micro = await createMicroCycleService(body, userID);

  const safe = {
    id: micro.id,
    microCycleName: micro.microCycleName,
    createdAt: micro.createdAt,
    trainingDays: micro.trainingDays,
    user: {
      id: micro.user.id,
      name: micro.user.name,
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
  const { microCycleID, workoutID } = req.params;
  const userID = req.id;

  const updatedMicroCycle = await addWorkoutsToMicroCycleService(
    microCycleID,
    workoutID,
    userID
  );

  return res.status(200).json(updatedMicroCycle);
};

export const deleteMicroCycleController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { microCycleID } = req.params;
  const userID = req.id;
  await deleteMicroCycleService(microCycleID, userID);
  return res.status(204).send();
};

export const getMicroCycleByIDController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const userID = req.id;

    const microCycle = await getMicroCycleByIDService(id, userID);

    return res.status(200).json(microCycle);
};