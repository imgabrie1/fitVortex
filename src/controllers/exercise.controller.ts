import { Request, Response } from "express";
import { iExercise } from "../interfaces/exercise.interface";
import createExerciseService from "../services/exercise/createExercise.service";
import { getExerciseService } from "../services/exercise/getExerciseById.service";
import patchExerciseService from "../services/exercise/patchExercise.service";
import deleteExerciseService from "../services/exercise/deleteExercise.service";
import { AppError } from "../errors";

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

export const patchExerciseController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  let updatedData = {... req.body}


  const updatedExercise = await patchExerciseService(updatedData, id)

  return res.status(200).json(updatedExercise)
};

export const deleteExerciseController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  const exercise = await deleteExerciseService(id);

  if (!exercise) {
    throw new AppError("exercício não encontrado", 404);
  }

  return res.status(204).send();
};

