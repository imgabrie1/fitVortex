import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MuscleGroup } from "../enum/muscleGroup.enum";
import { Set } from "./set.entity";
import { WorkoutExercise } from "./workoutExercise.entity";

@Entity()
export class Exercise {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "varchar", length: 50 })
    name: string

    @Column({ type: "varchar", nullable: true })
    description: string | null

    @Column({ type: "enum", enum: MuscleGroup })
    primaryMuscle: MuscleGroup

    @Column({ type: "enum", enum: MuscleGroup, nullable: true })
    secondaryMuscle: MuscleGroup | null

    @OneToMany(() => WorkoutExercise, workoutExercise => workoutExercise.exercise)
    workoutExercises: WorkoutExercise[];

    @OneToMany(() => Set, (set) => set.exercise)
    sets: Set[];
}
