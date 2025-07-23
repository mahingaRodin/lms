import { Expose, Type } from 'class-transformer';
import { InspectionResponseDto } from './inspection-response.dto';

export class PermitResponseDto {
  @Expose()
  id: string;

  @Expose()
  status: string;

  @Expose()
  buildingPlanFileName: string;

  @Expose()
  @Type(() => InspectionResponseDto)
  inspections: InspectionResponseDto[];

  @Expose()
  landPlot: {
    id: string;
    parcelNumber: string;
    boundary: GeoJSON.Polygon;
    areaHectares: number;
  };

  constructor(partial: Partial<PermitResponseDto>) {
    Object.assign(this, partial);
  }
}
