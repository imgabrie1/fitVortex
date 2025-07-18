import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinTable,
  ManyToMany
} from "typeorm";
import { Exercise } from "./exercise.entity";
import { MicroCycleItem } from "./microCycleItem.entity";

@Entity()
export class Workout {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50 })
  name: string;

  @OneToMany(() => MicroCycleItem, item => item.workout)
  cycleItems: MicroCycleItem[];

  @ManyToMany(() => Exercise, { eager: true })
  @JoinTable()
  exercises: Exercise[];
}
