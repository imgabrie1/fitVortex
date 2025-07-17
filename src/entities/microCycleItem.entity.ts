import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn
} from "typeorm";
import { MicroCycle } from "./microCycle.entity";
import { Workout } from "./workout.entity";

@Entity()
export class MicroCycleItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => MicroCycle, mc => mc.cycleItems, { onDelete: 'CASCADE' })
  microCycle: MicroCycle;

  @ManyToOne(() => Workout, w => w.cycleItems, { eager: true })
  workout: Workout;

  @CreateDateColumn()
  createdAt: Date;
}
