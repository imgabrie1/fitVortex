import { DeepPartial, Repository } from "typeorm"
import z from "zod"
import { Exercise } from "../entities/exercise.entity"
import { exerciseSchema, returnExerciseSchema, returnMultipleExerciseSchema } from "../schemas/exercise.schema"


export type iExercise = z.infer<typeof exerciseSchema>
export type iExerciseReturn = z.infer<typeof returnExerciseSchema>
export type iExercisesReturn = z.infer<typeof returnMultipleExerciseSchema>
export type iExerciseUpdate = DeepPartial<iExercise>

export type iRepoExercise = Repository<Exercise>