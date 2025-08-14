import { Request, Response } from "express";
import { adjustVolumeService } from "../services/macroCycle/adjustVolume.service";

export const adjustVolumeController = async (req: Request, res: Response): Promise<Response> => {
    const { macroCycleId } = req.params;
    const userId = res.locals.user.id;

    const { weights, rules } = req.body;

    const options = {
        weights: {
            firstVsLast: weights?.firstVsLast ?? 0.6,
            weeklyAverage: weights?.weeklyAverage ?? 0.4,
        },
        rules: {
            increase: {
                threshold: rules?.increase?.threshold ?? 10,
                percentage: rules?.increase?.percentage ?? 10,
            },
            decrease: {
                threshold: rules?.decrease?.threshold ?? 0,
                percentage: rules?.decrease?.percentage ?? -10,
            },
            maintain: {
                threshold: rules?.maintain?.threshold ?? 0,
            },
        },
    };

    const analysis = await adjustVolumeService(macroCycleId, userId, options);

    return res.json(analysis);
};
