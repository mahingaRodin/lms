import { Expose } from 'class-transformer';

export class TaxRecordResponseDto {
  @Expose()
  id: string;

  @Expose()
  amount: number;

  @Expose()
  dueDate: Date;

  @Expose()
  isPaid: boolean;

  @Expose()
  landPlot: {
    id: string;
    parcelNumber: string;
    address: string;
  };

  constructor(partial: Partial<TaxRecordResponseDto>) {
    Object.assign(this, partial);
  }
}
