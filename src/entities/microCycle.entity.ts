import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { MicroCycleVolume } from "./microCycleVolume.entity";
import { MicroCycleItem } from "./microCycleItem.entity";
import { MacroCycle } from "./macroCycle.entity";

@Entity()
export class MicroCycle {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  microCycleName: string;

  @CreateDateColumn({ type: "date" })
  createdAt: Date | string;

  @Column({ type: "int", default: 1 })
  trainingDays: number;

  @OneToMany(() => MicroCycleVolume, v => v.microCycle)
  volumes: MicroCycleVolume[];

  @ManyToOne(() => User, u => u.microCycles, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "userID" })
  user: User;

  @ManyToOne(() => MacroCycle, macro => macro.microCycles, { onDelete: "CASCADE" })
  @JoinColumn({ name: "macroCycleId" })
  macroCycle: MacroCycle;

  @OneToMany(() => MicroCycleItem, item => item.microCycle, { cascade: true })
  cycleItems: MicroCycleItem[];
}
