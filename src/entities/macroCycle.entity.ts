import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany
} from "typeorm";
import { User } from "./user.entity";
import { MacroCycleItem } from "./macroCycleItem.entity";
import { MacroCycleVolume } from "./macroCycleVolume.entity";

@Entity()
export class MacroCycle {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, user => user.macroCycles)
  user: User;

  @Column({ type: "date" })
  startDate: string;

  @Column({ type: "date" })
  endDate: string;

  @Column({ type: "int" })
  microQuantity: number;

  @OneToMany(() => MacroCycleItem, item => item.macroCycle, { cascade: true })
  items: MacroCycleItem[];

  @OneToMany(() => MacroCycleVolume, volume => volume.macroCycle, { cascade: true })
  volumes: MacroCycleVolume[];
}
