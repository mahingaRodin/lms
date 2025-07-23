import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class SystemSettings {
  @PrimaryColumn({ default: 'default' })
  id: string = 'default';

  @Column({
    type: 'jsonb',
    default: {
      residential: 1000,
      commercial: 2000,
      agricultural: 500,
    },
  })
  taxRates: Record<string, number>;

  @Column({
    type: 'jsonb',
    default: {
      steps: ['SUBMISSION', 'REVIEW', 'INSPECTION'],
      requiredDocuments: ['LAND_TITLE', 'BUILDING_PLAN'],
    },
  })
  permitWorkflow: {
    steps: string[];
    requiredDocuments: string[];
  };

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
