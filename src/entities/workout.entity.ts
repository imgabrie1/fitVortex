import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { MicroCycle } from "./microCycle.entity";
import { Exercise } from "./exercise.entity";

@Entity()
export class Workout {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50 })
  name: string;

  @ManyToOne(() => MicroCycle, microCycle => microCycle.workouts)
  microCycle: MicroCycle;

  @ManyToMany(() => Exercise, { eager: true })
  @JoinTable()
  exercises: Exercise[];
}