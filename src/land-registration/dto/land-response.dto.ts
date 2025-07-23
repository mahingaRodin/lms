import { Exclude, Expose } from 'class-transformer';
import { OwnerResponseDto } from './owner-response.dto';
import { Polygon } from 'geojson';

export class LandPlotResponseDto {
  id: string;
  parcelNumber: string;
  areaHectares: number;
  boundary: Polygon;
  createdAt: Date;
  owners: OwnerResponseDto[];

  @Exclude()
  taxRecords: any;

  @Exclude()
  disputes: any;

  @Exclude()
  constructionPermit: any;

  constructor(partial: Partial<LandPlotResponseDto>) {
    Object.assign(this, partial);
  }
}
