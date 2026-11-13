import { Request, Response } from "express";
import { iWorkout } from "../interfaces/workout.interface";
import { createWorkoutService } from "../services/workout/createWorkout.service";
import { getAllUserWorkoutsService } from "../services/workout/getAllUserWorkouts.service";
import patchWorkoutService from "../services/workout/patchWorkout.service";
import { recordWorkoutService } from "../services/microCycle/recordWorkout.service";
import { editRecordedWorkoutService } from "../services/microCycle/editRecordedWorkout.service";
import { removeExerciseFromWorkoutService } from "../services/workout/removeExerciseFromWorkout.service";
import { replaceExerciseInWorkoutService } from "../services/workout/replaceExerciseInWorkout.service";

export const createWorkoutController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const workoutData: iWorkout = req.body;

  const newWorkout = await createWorkoutService(workoutData);

  return res.status(201).json(newWorkout);
};

export const getAllUserWorkoutsController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;
  const { id } = req;

  const result = await getAllUserWorkoutsService(page, limit, id);

  return res.status(200).json(result);
};

export const patchWorkoutController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  const updatedWorkout = await patchWorkoutService(req.body, id);

  return res.status(200).json(updatedWorkout);
};

export const recordWorkoutController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { microCycleID, workoutID } = req.params;
  const workoutData = req.body;

  const updatedMicroCycleItem = await recordWorkoutService(
    microCycleID,
    workoutID,
    workoutData
  );

  return res.status(200).json(updatedMicroCycleItem);
};

export const editRecordedWorkoutController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { microCycleID, workoutID } = req.params;
  const workoutData = req.body;

  const updatedMicroCycleItem = await editRecordedWorkoutService(
    microCycleID,
    workoutID,
    workoutData
  );

  return res.status(200).json(updatedMicroCycleItem);
};

export const removeExerciseFromWorkoutController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { workoutId, workoutExerciseId } = req.params;

  await removeExerciseFromWorkoutService(workoutId, workoutExerciseId);

  return res.status(204).send();
};

export const replaceExerciseInWorkoutController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { workoutId, workoutExerciseId } = req.params;

  const updatedWorkout = await replaceExerciseInWorkoutService(
    workoutId,
    workoutExerciseId,
    req.body
  );

  return res.status(200).json(updatedWorkout);
};
