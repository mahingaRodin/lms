import { Exclude } from 'class-transformer';
import { OwnerResponseDto } from "./owner-response.dto";

export class LandPlotResponseDto {
  id: string;
  parcelNumber: string;
    areaHectares: number;
    address: string;
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
