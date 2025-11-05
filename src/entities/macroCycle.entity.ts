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

  @ManyToOne(() => User, (user: User) => user.macroCycles, {
    onDelete: "CASCADE",
  })
  user: User;

  @Column({ type: "varchar", length: 50 })
  macroCycleName: string;

  @Column({ type: "date" })
  startDate: string;

  @Column({ type: "date" })
  endDate: string;

  @Column({ type: "int" })
  microQuantity: number;

  @OneToMany(() => MacroCycleItem, (item: MacroCycleItem) => item.macroCycle, {
    cascade: true,
  })
  items: MacroCycleItem[];

  @OneToMany(
    () => MacroCycleVolume,
    (volume: MacroCycleVolume) => volume.macroCycle,
    { cascade: true }
  )
  volumes: MacroCycleVolume[];
}
