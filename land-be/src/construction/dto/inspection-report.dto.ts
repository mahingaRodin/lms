import { IsString, IsNotEmpty } from 'class-validator';

export class InspectionReportDto {
  @IsString()
  @IsNotEmpty()
  report: string;
}
