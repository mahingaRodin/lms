import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { LandPlot } from './land-plot.entity';

export enum DisputeStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  MEDIATION = 'mediation',
}

@Entity()
export class Dispute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: DisputeStatus, default: DisputeStatus.PENDING })
  status: DisputeStatus;

  @ManyToOne(() => User, (user) => user.disputesReported)
  reporter: User;

  @ManyToOne(() => LandPlot, (plot) => plot.disputes)
  landPlot: LandPlot;
}
