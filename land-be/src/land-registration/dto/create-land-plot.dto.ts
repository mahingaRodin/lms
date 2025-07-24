import { IsString, IsNumber, IsPositive, IsObject } from 'class-validator';
import { Polygon } from 'geojson';

export class CreateLandPlotDto {
  @IsString()
  parcelNumber: string;

  @IsObject()
  boundary: Polygon;

  @IsString()
  province: string;

  @IsString()
  district: string;

  @IsString()
  sector: string;

  @IsString()
  cell: string;

  @IsString()
  village: string;

  @IsNumber()
  @IsPositive()
  areaHectares: number;
}
