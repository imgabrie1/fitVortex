import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
  Column,
} from "typeorm";
import { MicroCycle } from "./microCycle.entity";
import { Workout } from "./workout.entity";
import { Set } from "./set.entity";

@Entity()
export class MicroCycleItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => MicroCycle, (mc: MicroCycle) => mc.cycleItems, { onDelete: "CASCADE" })
  microCycle: MicroCycle;

  @ManyToOne(() => Workout, (w: Workout) => w.cycleItems, { eager: true })
  workout: Workout;

  @OneToMany(() => Set, (set: Set) => set.microCycleItem)
  sets: Set[];

  @Column({ type: "int" })
  position: number;

  @CreateDateColumn()
  createdAt: Date;
}
