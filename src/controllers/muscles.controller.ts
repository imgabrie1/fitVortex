import { Request, Response } from "express";
import { getMuscleGroupsList } from "../utils/muscleGroupList";

export const getMuscleGroupsController = (req: Request, res: Response) => {
  const muscles = getMuscleGroupsList();
  return res.status(200).json(muscles);
};
