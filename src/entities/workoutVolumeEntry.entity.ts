import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from "typeorm";
import { MuscleGroup } from "../enum/muscleGroup.enum";
import { WorkoutVolume } from "./workoutVolume.entity";

@Entity("workout_volume_entries")
@Unique(["workoutVolume", "muscleGroup"])
export class WorkoutVolumeEntry {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: MuscleGroup,
  })
  muscleGroup: MuscleGroup;

  @Column({ type: "float", default: 0 })
  volume: number;

  @Column({ type: "integer", default: 0 })
  sets: number;

  @ManyToOne(
    () => WorkoutVolume,
    (wv: WorkoutVolume) => wv.entries,
    { onDelete: "CASCADE" }
  )
  workoutVolume: WorkoutVolume;
}
