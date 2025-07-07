import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Execution } from "./execution.entity";
import { MuscleGroup } from "../enum/muscleGroup.enum";

@Entity()
export class ExecutionSet {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Execution, execution => execution.sets)
  execution: Execution;

  @Column({ type: "varchar" })
  exerciseName: string;

  @Column()
  muscleGroup: MuscleGroup;

  @Column({ type: "int" })
  reps: number;

  @Column({ type: "float" })
  weight: number;
}