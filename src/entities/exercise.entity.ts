import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { MuscleGroup } from "../enum/muscleGroup.enum";
import { Workout } from "./workout.entity";

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

    @ManyToMany(() => Workout, workout => workout.exercises)
    workouts: Workout[];
}