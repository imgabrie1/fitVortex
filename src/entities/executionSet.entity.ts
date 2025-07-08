import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Execution } from "./execution.entity";
import { MuscleGroup } from "../enum/muscleGroup.enum";
import { Exercise } from "./exercise.entity";

@Entity()
export class ExecutionSet {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Execution, execution => execution.sets)
  execution: Execution;

  @Column({ type: "varchar" })
  exerciseName: string;

  @ManyToOne(()=> Exercise, exercise => exercise.executionSets)
  exercise: Exercise

  @Column({ type: "int" })
  reps: number;

  @Column({ type: "float" })
  weight: number;

  @Column({ type: "int" })
  RIR: number
}