import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Workout } from "./workout.entity";
import { Exercise } from "./exercise.entity";

@Entity("workout_exercises")
export class WorkoutExercise {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "integer" })
  targetSets: number;

  @ManyToOne(() => Workout, (workout) => workout.workoutExercises, {
    onDelete: "CASCADE",
  })
  workout: Workout;

  @ManyToOne(() => Exercise, (exercise) => exercise.workoutExercises, {
    eager: true,
    onDelete: "CASCADE",
  })
  exercise: Exercise;

  @Column({ type: "int" })
  position: number;
}
