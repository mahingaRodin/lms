import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreatePermitDto {
  @IsUUID()
  @IsNotEmpty()
  landPlotId: string;

  @IsNotEmpty()
  buildingPlanFileName: string;
}
