import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { MicroCycleItem } from "./microCycleItem.entity";
import { WorkoutVolume } from "./workoutVolume.entity";
import { WorkoutExercise } from "./workoutExercise.entity";

@Entity()
export class Workout {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50 })
  name: string;

  @OneToMany(() => MicroCycleItem, (item: MicroCycleItem) => item.workout, {
    cascade: true,
  })
  cycleItems: MicroCycleItem[];

  @OneToMany(() => WorkoutExercise, (workoutExercise: WorkoutExercise) => workoutExercise.workout, { cascade: true, eager: true })
  workoutExercises: WorkoutExercise[];

  @OneToOne(() => WorkoutVolume, (volume: WorkoutVolume) => volume.workout, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  volume: WorkoutVolume;
}
