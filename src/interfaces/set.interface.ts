import { z } from 'zod';
import { recordWorkoutSchema, setSchema } from '../schemas/set.schema';

export type TSet = z.infer<typeof setSchema>;
export type TRecordWorkout = z.infer<typeof recordWorkoutSchema>;
