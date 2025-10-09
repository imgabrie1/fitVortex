import { DeepPartial, Repository } from "typeorm"
import z from "zod"
import { Workout } from "../entities/workout.entity"
import { workoutSchema, returnWorkoutSchema, updateWorkoutSchema } from "../schemas/workout.schema"


export type iWorkout = z.infer<typeof workoutSchema>
export type iWorkoutReturn = z.infer<typeof returnWorkoutSchema>
export type iWorkoutUpdate = z.infer<typeof updateWorkoutSchema>

export type iRepoWorkout = Repository<Workout>
