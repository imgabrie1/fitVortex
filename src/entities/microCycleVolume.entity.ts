import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { MicroCycle } from "./microCycle.entity";
import { MuscleGroup } from "../enum/muscleGroup.enum";

@Entity()
export class MicroCycleVolume {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => MicroCycle, cycle => cycle.volumes)
  microCycle: MicroCycle;

  @Column({ type: "enum", length: 50 })
  muscleGroup: MuscleGroup;

  @Column({ type: "int" })
  totalVolume: number; // weight * reps somado
}