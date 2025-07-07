import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Execution } from "./execution.entity";

@Entity()
export class ExecutionSet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Execution, exec => exec.sets)
  execution: Execution;

  @Column()
  exerciseName: string;

  @Column()
  muscleGroup: string;

  @Column({ type: 'int' })
  reps: number;

  @Column({ type: 'float' })
  weight: number;
}