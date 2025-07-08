import { Request, Response } from "express";
import { iExercise } from "../interfaces/exercise.interface";
import createExerciseService from "../services/exercise/createExercise.service";

export const createExerciseController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const exerciseData: iExercise = req.body;

  const newExercise = await createExerciseService(exerciseData);


  return res.status(201).json(newExercise);
};
