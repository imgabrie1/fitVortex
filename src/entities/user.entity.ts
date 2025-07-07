import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { MacroCycle } from "./macroCycle.entity";
import { Workout } from "./workout.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @OneToMany(() => Workout, w => w.user)
  workouts: Workout[];

  @OneToMany(() => MacroCycle, m => m.user)
  macroCycles: MacroCycle[];
}
