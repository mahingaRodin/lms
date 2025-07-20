import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from "./user.entity";
import { LandPlot } from "./land-plot.entity";

export enum PermitStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity()
export class ConstructionPermit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  buildingPlanFileName: string;

  @Column({ nullable: true })
  buildingPlanFilePath: string;

  @Column({ type: 'enum', enum: PermitStatus, default: PermitStatus.PENDING })
  status: PermitStatus;

  // Relationships
  @ManyToOne(() => User, (user) => user.permits)
  applicant: User;

  @OneToOne(() => LandPlot, (plot) => plot.constructionPermit)
  landPlot: LandPlot;
}
