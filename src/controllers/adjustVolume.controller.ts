import { Request, Response } from "express";
import { adjustVolumeService } from "../services/macroCycle/adjustVolume.service";

export const adjustVolumeController = async (req: Request, res: Response): Promise<Response> => {
    const { macroCycleId } = req.params;
    const userId = res.locals.user.id;

    const { weights, rules } = req.body;

    const defaultIncreaseRules = [
        { threshold: 20, percentage: 20 },
        { threshold: 15, percentage: 15 },
        { threshold: 10, percentage: 10 },
    ];

    const defaultDecreaseRules = [
        { threshold: -20, percentage: -20 },
        { threshold: -15, percentage: -15 },
        { threshold: -10, percentage: -10 },
    ];

    const options = {
        weights: {
            firstVsLast: weights?.firstVsLast ?? 0.6,
            weeklyAverage: weights?.weeklyAverage ?? 0.4,
        },
        rules: {
            increase: rules?.increase ?? defaultIncreaseRules,
            decrease: rules?.decrease ?? defaultDecreaseRules,
            maintain: {
                threshold: rules?.maintain?.threshold ?? 9,
            },
        },
    };

    const analysis = await adjustVolumeService(macroCycleId, userId, options);

    return res.json(analysis);
};
