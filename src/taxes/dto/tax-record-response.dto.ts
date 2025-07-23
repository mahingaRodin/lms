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
    boundary: GeoJSON.Polygon;
    areaHectares: number;
  };

  constructor(partial: Partial<TaxRecordResponseDto>) {
    Object.assign(this, partial);
  }
}
