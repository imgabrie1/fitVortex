import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MuscleGroup } from "../enum/muscleGroup.enum";
import { Workout } from "./workout.entity";
import { Set } from "./set.entity";

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

    @OneToMany(() => Set, (set) => set.exercise)
    sets: Set[];
}