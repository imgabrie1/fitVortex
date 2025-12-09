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
import { MacroCycleItem } from "./macroCycleItem.entity";
import { MicroCycleItem } from "./microCycleItem.entity";

@Entity()
export class MicroCycle {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  microCycleName: string;

  @OneToMany(() => MacroCycleItem, item => item.microCycle)
  macroItems: MacroCycleItem[];

  @CreateDateColumn({ type: "date" })
  createdAt: Date | string;

  @Column({ type: "int", default: 1 })
  trainingDays: number;

  @OneToMany(() => MicroCycleVolume, v => v.microCycle, { cascade: true })
  volumes: MicroCycleVolume[];

  @ManyToOne(() => User, u => u.microCycles, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "userID" })
  user: User;

  @OneToMany(() => MicroCycleItem, item => item.microCycle, { cascade: true })
  cycleItems: MicroCycleItem[];
}
