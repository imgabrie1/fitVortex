import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany } from "typeorm";
import { MacroCycle } from "./macroCycle.entity";
import { MicroCycleVolume } from "./microCycleVolume.entity";

@Entity()
export class MicroCycle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MacroCycle, macro => macro.microCycles)
  macroCycle: MacroCycle;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @OneToMany(() => MicroCycleVolume, v => v.microCycle, { cascade: true })
  volumes: MicroCycleVolume[];
}