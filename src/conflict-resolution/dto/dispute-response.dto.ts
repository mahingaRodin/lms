import { Expose } from 'class-transformer';

export class DisputeResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  landPlot: {
    id: string;
    parcelNumber: string;
    boundary: GeoJSON.Polygon;
    areaHectares: number;
  };

  @Expose()
  reporter: {
    id: string;
    fullName: string;
  };

  @Expose()
  resolutionNotes?: string;

  constructor(partial: Partial<DisputeResponseDto>) {
    Object.assign(this, partial);
  }
}
