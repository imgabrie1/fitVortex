import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Workout } from "./workout.entity";
import { Exercise } from "./exercise.entity";

@Entity("workout_exercises")
export class WorkoutExercise {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "integer" })
  targetSets: number;

  @ManyToOne(() => Workout, (workout: Workout) => workout.workoutExercises, {
    onDelete: "CASCADE",
  })
  workout: Workout;

  @ManyToOne(
    () => Exercise,
    (exercise: Exercise) => exercise.workoutExercises,
    {
      eager: true,
      onDelete: "CASCADE",
    }
  )
  exercise: Exercise;

  @Column({ type: "boolean", default: false })
  is_unilateral: boolean;

  @Column({ type: "int" })
  position: number;
}
