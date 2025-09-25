import { Request, Response } from "express"
import { returnMacroCycleSchema } from "../schemas/macroCycle.schema"
import { createMacroCycleService } from "../services/macroCycle/createMacroCycle.service"
import { addMicroCycleToMacroCycleService } from "../services/macroCycle/addMicroCycleToMacroCycle.service"
import { deleteMacroCycleService } from "../services/macroCycle/deleteMacroCycle.service";
import { getMacroCycleByIDService } from "../services/macroCycle/getMacroCycleById.service";
import { adjustVolumeService } from "../services/macroCycle/adjustVolume.service";
import { getAllMacroCycleService } from "../services/macroCycle/getAllMacro.service";

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

export const getAllMacroCycleController = async (req: Request, res: Response): Promise<Response> => {
    const userID = req.id;

    const macroCycle = await getAllMacroCycleService(userID);

    return res.status(200).json(macroCycle);
};

export const adjustVolumeController = async (req: Request, res: Response): Promise<Response> => {
    const { macroCycleId } = req.params;
    const userId = req.id;

    const { weights, rules } = req.body;

    const options = {
        weights: {
            firstVsLast: weights?.firstVsLast ?? 0.6,
            weeklyAverage: weights?.weeklyAverage ?? 0.4,
        },
        rules: {
            increase: rules?.increase ?? [
                { threshold: 20, percentage: 20 },
                { threshold: 15, percentage: 15 },
                { threshold: 10, percentage: 10 },
            ],
            decrease: rules?.decrease ?? [
                { threshold: -20, percentage: -20 },
                { threshold: -15, percentage: -15 },
                { threshold: -10, percentage: -10 },
            ],
            maintain: {
                threshold: rules?.maintain?.threshold ?? 9,
            },
        },
    };

    const analysis = await adjustVolumeService(macroCycleId, userId, options);

    return res.json(analysis);
};