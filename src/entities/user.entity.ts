import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { MacroCycle } from "./macroCycle.entity";
import { getRounds, hashSync } from "bcryptjs";
import { MicroCycle } from "./microCycle.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50 })
  email: string;

  @Column({ type: "varchar", length: 50 })
  name: string;

  @Column({ type: "varchar", length: 125 })
  password: string;

  @Column({ default: false })
  admin: boolean;

  @CreateDateColumn({ type: "date" })
  createdAt: Date | string;

  @UpdateDateColumn({ type: "date" })
  updatedAt: Date | string;

  @OneToMany(() => MicroCycle, (microCycle: MicroCycle) => microCycle.user, {
    onDelete: "CASCADE",
  })
  microCycles: MicroCycle[];

  @OneToMany(() => MacroCycle, (macroCycle: MacroCycle) => macroCycle.user, {
    onDelete: "CASCADE",
  })
  macroCycles: MacroCycle[];

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    const isEncrypt = getRounds(this.password);
    if (!isEncrypt) {
      this.password = hashSync(this.password, 10);
    }
  }

  toJSON() {
    const { password, admin, ...user } = this;
    return user;
  }
}
