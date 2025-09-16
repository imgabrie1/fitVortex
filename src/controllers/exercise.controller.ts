import { Request, Response } from "express";
import { iExercise } from "../interfaces/exercise.interface";
import createExerciseService from "../services/exercise/createExercise.service";
import { getExerciseByIDService } from "../services/exercise/getExerciseById.service";
import patchExerciseService from "../services/exercise/patchExercise.service";
import deleteExerciseService from "../services/exercise/deleteExercise.service";
import { AppError } from "../errors";
import { getExercisesService } from "../services/exercise/getExercises.service";

export const createExerciseController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const exerciseData: iExercise = req.body;

  const newExercise = await createExerciseService(exerciseData);


  return res.status(201).json(newExercise);
};

export const getExerciseByIDController = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params

  const exercise = await getExerciseByIDService(id)

  return res.status(200).json(exercise)
}

export const getExercisesController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await getExercisesService(page, limit);

  return res.status(200).json(result);
};

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

