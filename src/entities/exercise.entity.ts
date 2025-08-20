import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MuscleGroup } from "../enum/muscleGroup.enum";
import { Set } from "./set.entity";
import { WorkoutExercise } from "./workoutExercise.entity";

enum ResistanceType {
  BODYWEIGHT = "bodyweight", // peso corporal
  FREE_WEIGHT = "free_weight", // halter, anilha, barra
  MACHINE_PLATE = "machine_plate", // máquinas com anilha
  MACHINE_STACK = "machine_stack", // polias
  BAND = "band", // elástico
  OTHER = "other"
}

@Entity()
export class Exercise {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "varchar", length: 50 })
    name: string


    @Column({type: "varchar", nullable: true, default: null})
    imageURL: string | null

    @Column({ type: "varchar", nullable: true })
    description: string | null

    @Column({ type: "enum", enum: MuscleGroup })
    resistanceType: ResistanceType

    @Column({ type: "enum", enum: MuscleGroup })
    primaryMuscle: MuscleGroup

    @Column({ type: "jsonb", nullable: true, default: [], enum: MuscleGroup })
    secondaryMuscle: MuscleGroup[] | null

    @OneToMany(() => WorkoutExercise, workoutExercise => workoutExercise.exercise)
    workoutExercises: WorkoutExercise[];

    @OneToMany(() => Set, (set) => set.exercise)
    sets: Set[];
}

