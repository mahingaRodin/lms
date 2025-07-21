import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { LandOwner } from './land-owner.entity';
import { TaxRecord } from './tax-record.entity';
import { Dispute } from './dispute.entity';
import { ConstructionPermit } from "./construction-permit.entity";

@Entity()
export class LandPlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  parcelNumber: string;

  @Column()
  address: string;

  @Column({ type: 'float' })
  areaHectares: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => LandOwner, (owner) => owner.landPlot)
  owners: LandOwner[];

  @OneToMany(() => TaxRecord, (tax) => tax.landPlot)
  taxRecords: TaxRecord[];

  @OneToMany(() => Dispute, (dispute) => dispute.landPlot)
  disputes: Dispute[];

  @OneToOne(() => ConstructionPermit, (permit) => permit.landPlot)
  constructionPermit: ConstructionPermit;
}
