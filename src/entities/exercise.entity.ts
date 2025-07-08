import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MuscleGroup } from "../enum/muscleGroup.enum";
import { ExecutionSet } from "./executionSet.entity";

@Entity()
export class Exercise {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "varchar", length: 50 })
    name: string

    @Column({ type: "varchar", nullable: true })
    description: string

    @Column({ type: "enum", enum: MuscleGroup })
    primaryMuscle: MuscleGroup

    @Column({ type: "enum", enum: MuscleGroup, nullable: true })
    secondaryMuscle: MuscleGroup

    @OneToMany(()=> ExecutionSet, set => set.exercise)
    executionSets: ExecutionSet[]

}