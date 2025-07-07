import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { MicroCycle } from "./microCycle.entity";

@Entity()
export class MicroCycleVolume {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MicroCycle, cycle => cycle.volumes)
  microCycle: MicroCycle;

  @Column()
  muscleGroup: string;

  @Column({ type: 'int' })
  totalVolume: number; // weight * reps somado
}