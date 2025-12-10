import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { MacroCycleVolume } from "./macroCycleVolume.entity";
import { MicroCycle } from "./microCycle.entity";

@Entity()
export class MacroCycle {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50 })
  macroCycleName: string;

  @Column({ type: "date" })
  startDate: string;

  @Column({ type: "date" })
  endDate: string;

  @Column({ type: "int" })
  microQuantity: number;

  @ManyToOne(() => User, (user) => user.macroCycles, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @OneToMany(() => MicroCycle, (microCycle) => microCycle.macroCycle, { cascade: true })
  microCycles: MicroCycle[];

  @OneToMany(() => MacroCycleVolume, (volume) => volume.macroCycle, {
    cascade: true,
  })
  volumes: MacroCycleVolume[];
}
