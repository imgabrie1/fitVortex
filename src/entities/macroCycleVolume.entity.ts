import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { MuscleGroup } from "../enum/muscleGroup.enum";
import { MacroCycle } from "./macroCycle.entity";

@Entity()
export class MacroCycleVolume {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => MacroCycle, (cycle) => cycle.volumes)
  macroCycle: MacroCycle;

  @Column({ type: "enum", enum: MuscleGroup })
  muscleGroup: MuscleGroup;

  @Column({ type: "int" })
  totalVolume: number;

  @Column({ type: "int" })
  changePct: number;

  @Column({ type: "enum", enum: ["up", "down", "same"] })
  recommendation: "up" | "down" | "same";
}
