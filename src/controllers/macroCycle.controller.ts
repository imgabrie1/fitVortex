import { Request, Response } from "express"
import { returnMacroCycleSchema } from "../schemas/macroCycle.schema"
import { createMacroCycleService } from "../services/macroCycle/createMacroCycle.service"
import { addMicroCycleToMacroCycleService } from "../services/macroCycle/addMicroCycleToMacroCycle.service"
import { deleteMacroCycleService } from "../services/macroCycle/deleteMacroCycle.service";
import { getMacroCycleByIDService } from "../services/macroCycle/getMacroCycleById.service";

export const createMacroCycleController = async (req: Request, res: Response): Promise<Response> => {
    const body = req.body
    const userID = req.id

    const macro = await createMacroCycleService(body, userID)

    const output = returnMacroCycleSchema.parse(macro)
    return res.status(201).json(output)
}

export const addMicroCycleToMacroCycleController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { macroCycleID, microCycleID } = req.params;
  const userID = req.id;

  const updatedMicroCycle = await addMicroCycleToMacroCycleService(
    macroCycleID,
    microCycleID,
    userID
  );

  return res.status(200).json(updatedMicroCycle);
};

export const deleteMacroCycleController = async (req: Request, res: Response): Promise<Response> => {
    const { macroCycleID } = req.params;
    const userID = req.id;
    await deleteMacroCycleService(macroCycleID, userID);
    return res.status(204).send();
};

export const getMacroCycleByIDController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const userID = req.id;

    const macroCycle = await getMacroCycleByIDService(id, userID);

    return res.status(200).json(macroCycle);
};