import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Workout } from "./workout.entity";
import { Exercise } from "./exercise.entity";

@Entity("workout_exercises")
export class WorkoutExercise {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "integer" })
    targetSets: number;

    // @Column({ type: "varchar", length: 20, nullable: true })
    // targetReps: string | null; // Ex: "8-12"

    // @Column({ type: "integer", nullable: true })
    // restTimeInSeconds: number | null;

    @ManyToOne(() => Workout, workout => workout.workoutExercises, { onDelete: 'CASCADE' })
    workout: Workout;

    @ManyToOne(() => Exercise, exercise => exercise.workoutExercises, { eager: true, onDelete: 'CASCADE' })
    exercise: Exercise;
}
