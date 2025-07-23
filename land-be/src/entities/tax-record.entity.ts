import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { LandPlot } from "./land-plot.entity";
// import { LandPlot } from './';

@Entity()
export class TaxRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ default: false })
  isPaid: boolean;

  @ManyToOne(() => LandPlot, (plot) => plot.taxRecords)
  landPlot: LandPlot;
}
