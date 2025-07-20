import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from "./user.entity";
import { LandPlot } from "./land-plot.entity";

@Entity()
export class LandOwner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  ownershipStartDate: Date;

  @Column({ type: 'date', nullable: true })
  ownershipEndDate: Date | null; // Null = current owner

  @Column()
  ownershipType: 'freehold' | 'leasehold' | 'customary';

  @ManyToOne(() => User, (user) => user.ownedLands)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => LandPlot, (plot) => plot.owners)
  @JoinColumn({ name: 'landPlotId' })
  landPlot: LandPlot;
}
