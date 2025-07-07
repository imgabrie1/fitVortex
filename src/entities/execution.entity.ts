import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany } from "typeorm";
import { Workout } from "./workout.entity";
import { ExecutionSet } from "./executionSet.entity";
import { MicroCycle } from "./microCycle.entity";

@Entity()
export class Execution {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Workout)
  workout: Workout;

  @ManyToOne(() => MicroCycle)
  microCycle: MicroCycle;

  @Column({ type: "date" })
  date: Date | string;

  @OneToMany(() => ExecutionSet, set => set.execution, { cascade: true })
  sets: ExecutionSet[];
}