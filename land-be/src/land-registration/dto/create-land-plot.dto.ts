import { IsString, IsNumber, IsPositive, IsObject } from 'class-validator';
import { Polygon } from 'geojson';

export class CreateLandPlotDto {
  @IsString()
  parcelNumber: string;

  @IsObject()
  boundary: Polygon;

  @IsNumber()
  @IsPositive()
  areaHectares: number;
}
