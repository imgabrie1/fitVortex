import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany } from "typeorm";
import { MacroCycle } from "./macroCycle.entity";
import { MicroCycleVolume } from "./microCycleVolume.entity";

@Entity()
export class MicroCycle {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => MacroCycle, macroCycle => macroCycle.microCycles)
  macroCycle: MacroCycle;

  @Column({ type: "date" })
  startDate: Date | string;

  @Column({ type: "date" })
  endDate: Date | string;

  @OneToMany(() => MicroCycleVolume, volume => volume.microCycle, { cascade: true })
  volumes: MicroCycleVolume[];
}