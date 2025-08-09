import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Workout } from "./workout.entity";
import { WorkoutVolumeEntry } from "./workoutVolumeEntry.entity";

@Entity("workout_volumes")
export class WorkoutVolume {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Workout, (w) => w.volume, { onDelete: "CASCADE" })
  workout: Workout;

  @OneToMany(
    () => WorkoutVolumeEntry,
    (entry) => entry.workoutVolume,
    { cascade: true, eager: true }
  )
  entries: WorkoutVolumeEntry[];
}
