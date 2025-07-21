import { IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateLandPlotDto {
  @IsString()
  address: string;

  @IsString()
  parcelNumber: string;

  @IsNumber()
  @IsPositive()
  areaHectares: number;
}
