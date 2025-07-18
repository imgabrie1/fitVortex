import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn
} from "typeorm";
import { MacroCycle } from "./macroCycle.entity";
import { MicroCycle } from "./microCycle.entity";

@Entity()
export class MacroCycleItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => MacroCycle, macro => macro.items, { onDelete: 'CASCADE' })
  macroCycle: MacroCycle;

  @ManyToOne(() => MicroCycle, micro => micro.macroItems, { eager: true })
  microCycle: MicroCycle;

  @CreateDateColumn()
  createdAt: Date;
}
