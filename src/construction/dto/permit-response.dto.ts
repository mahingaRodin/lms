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
    address: string;
  };

  constructor(partial: Partial<PermitResponseDto>) {
    Object.assign(this, partial);
  }
}
