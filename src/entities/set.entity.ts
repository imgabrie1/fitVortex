import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MicroCycleItem } from "./microCycleItem.entity";
import { Exercise } from "./exercise.entity";
import { Side } from "../enum/side.enum";

@Entity("sets")
export class Set {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "integer" })
    reps: number

    @Column({ type: "decimal", precision: 5, scale: 2 })
    weight: number

    @Column({ type: "varchar", length: 255, nullable: true })
    notes: string | null

    @Column({ type: 'enum', enum: Side, default: Side.BOTH })
    side: Side;

    @ManyToOne(() => MicroCycleItem, (microCycleItem: MicroCycleItem) => microCycleItem.sets, { onDelete: 'CASCADE' })
    microCycleItem: MicroCycleItem;

    @ManyToOne(() => Exercise, (exercise: Exercise) => exercise.sets, { eager: true })
    exercise: Exercise;
}
