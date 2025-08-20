import { Request, Response } from "express";
import { generateNextMacroCycleService } from "../services/macroCycle/generateNextMacroCycle.service";

export const generateNextMacroCycleController = async (req: Request, res: Response): Promise<Response> => {
    const { id: macroCycleId } = req.params;
    const userId = req.id;
    const { prompt, createNewWorkout, maxSetsPerMicroCycle } = req.body;

    const newMacroCycle = await generateNextMacroCycleService({
        macroCycleId,
        userId,
        prompt,
        createNewWorkout,
        maxSetsPerMicroCycle
    });

    return res.status(201).json(newMacroCycle);
};