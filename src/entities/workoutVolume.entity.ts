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

  @OneToOne(() => Workout, (w: Workout) => w.volume, { onDelete: "CASCADE" })
  workout: Workout;

  @OneToMany(
    () => WorkoutVolumeEntry,
    (entry: WorkoutVolumeEntry) => entry.workoutVolume,
    { cascade: true, eager: true }
  )
  entries: WorkoutVolumeEntry[];
}
