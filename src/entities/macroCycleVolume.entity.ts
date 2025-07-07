import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { MacroCycle, VolumeRecommendation } from "./macroCycle.entity";

@Entity()
export class MacroCycleVolume {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MacroCycle, cycle => cycle.volumes)
  macroCycle: MacroCycle;

  @Column()
  muscleGroup: string;

  @Column({ type: 'int' })
  totalVolume: number;

  @Column({ type: 'int' })
  changePct: number;

  @Column({ type: 'enum', enum: ['up', 'same', 'down'] })
  recommendation: VolumeRecommendation;
}