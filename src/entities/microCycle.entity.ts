import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn
} from "typeorm";
import { MacroCycle } from "./macroCycle.entity";
import { MicroCycleVolume } from "./microCycleVolume.entity";
import { User } from "./user.entity";
import { Workout } from "./workout.entity";
import { MacroCycleItem } from "./macroCycleItem.entity";

@Entity()
export class MicroCycle {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // @ManyToOne(() => MacroCycle, m => m.microCycles, { nullable: true, onDelete: 'SET NULL' })
  // @JoinColumn({ name: "macroCycleId" })
  // macroCycle?: MacroCycle;

  @OneToMany(() => MacroCycleItem, (item) => item.microCycle)
  items: MacroCycleItem[];


  @CreateDateColumn({ type: "date" })
  createdAt: Date | string;

  @Column({ type: "int", default: 1, })
  trainingDays: number;

  @OneToMany(() => MicroCycleVolume, v => v.microCycle, { cascade: true })
  volumes: MicroCycleVolume[];

  @ManyToOne(() => User, u => u.microCycles, { nullable: false })
  @JoinColumn({ name: "userId" })
  user: User;

  @OneToMany(() => Workout, w => w.microCycle, { cascade: true })
  workouts: Workout[];
}