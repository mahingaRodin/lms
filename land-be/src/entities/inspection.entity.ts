import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ConstructionPermit } from "./construction-permit.entity";
import { User } from "./user.entity";

@Entity()
export class Inspection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  scheduledDate: Date;

  @Column({ nullable: true })
  actualDate: Date;

  @Column({ type: 'text', nullable: true })
  report: string;

  @ManyToOne(() => ConstructionPermit, (permit) => permit.inspections)
  permit: ConstructionPermit;

  @ManyToOne(() => User)
  inspector: User;
}
