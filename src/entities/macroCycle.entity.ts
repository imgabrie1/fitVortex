import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
} from "typeorm";
import { MicroCycle } from "./microCycle.entity";
import { User } from "./user.entity";
import { MacroCycleVolume } from "./macroCycleVolume.entity";

@Entity()
export class MacroCycle {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.macroCycles)
  user: User;

  @Column({ type: "date" })
  startDate: string;

  @Column({ type: "date" })
  endDate: string;

  @Column({ type: "int" })
  microQuantity: number;

  @OneToMany(() => MicroCycle, (microCycle) => microCycle.macroCycle, {
    cascade: true,
  })
  microCycles: MicroCycle[];

  @OneToMany(() => MacroCycleVolume, (volume) => volume.macroCycle, {
    cascade: true,
  })
  volumes: MacroCycleVolume[];
}

export type VolumeRecommendation = "up" | "down" | "same";
