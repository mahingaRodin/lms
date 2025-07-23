import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { LandPlot } from './land-plot.entity';

export enum TransferStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity()
export class LandTransfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TransferStatus,
    default: TransferStatus.PENDING,
  })
  status: TransferStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'currentOwnerId' })
  currentOwner: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'newOwnerId' })
  newOwner: User;

  @ManyToOne(() => LandPlot)
  @JoinColumn({ name: 'landPlotId' })
  landPlot: LandPlot;

  @Column({ type: 'text', nullable: true })
  adminNotes: string;
}
