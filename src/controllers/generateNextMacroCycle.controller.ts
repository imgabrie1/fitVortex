import { Request, Response } from "express";
import { generateNextMacroCycleService } from "../services/macroCycle/generateNextMacroCycle.service";

export const generateNextMacroCycleController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id: macroCycleId } = req.params;
  const userId = req.id;
  const { modifications, maxSetsPerMicroCycle } = req.body;
  // TODO: legPriority para funcionalidade futura (não utilizada ainda no service)
  // const { modifications, maxSetsPerMicroCycle, legPriority } = req.body;

  const { generatedMacroCycle } = await generateNextMacroCycleService({
    macroCycleId,
    userId,
    modifications,
    maxSetsPerMicroCycle,
  });

  return res.status(201).json(generatedMacroCycle);
};
