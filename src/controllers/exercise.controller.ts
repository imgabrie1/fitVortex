import { Request, Response } from "express";
import { iExercise } from "../interfaces/exercise.interface";
import createExerciseService from "../services/exercise/createExercise.service";
import { getExerciseService } from "../services/exercise/getExerciseById.service";

export const createExerciseController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const exerciseData: iExercise = req.body;

  const newExercise = await createExerciseService(exerciseData);


  return res.status(201).json(newExercise);
};

export const getExerciseController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params

  const exercise = await getExerciseService(id)

  return res.status(200).json(exercise)
}
