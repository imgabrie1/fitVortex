import { Request, Response } from "express"
import { macroCycleSchema } from "../schemas/macroCycle.schema"
import { createMacroCycleService } from "../services/macroCycle/createMacroCycle.service"
import { addMicroCycleToMacroCycleService } from "../services/macroCycle/addMicroCycleToMacroCycle.service"
import { deleteMacroCycleService } from "../services/macroCycle/deleteMacroCycle.service";

export const createMacroCycleController = async (req: Request, res: Response): Promise<Response> => {
    const body = req.body
    const userId = req.user!.id

    const macro = await createMacroCycleService(body, userId)

    const output = macroCycleSchema.parse(macro)
    return res.status(201).json(output)
}

export const addMicroCycleToMacroCycleController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { macroCycleId, microCycleId } = req.params;
  const userId = req.user.id;

  const updatedMicroCycle = await addMicroCycleToMacroCycleService(
    macroCycleId,
    microCycleId,
    userId
  );

  return res.status(200).json(updatedMicroCycle);
};

export const deleteMacroCycleController = async (req: Request, res: Response): Promise<Response> => {
    const { macroCycleId } = req.params;
    const userId = req.user.id;
    await deleteMacroCycleService(macroCycleId, userId);
    return res.status(204).send();
};