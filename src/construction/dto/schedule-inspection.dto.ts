import { IsDateString, IsUUID } from 'class-validator';

export class ScheduleInspectionDto {
  @IsDateString()
  scheduledDate: Date;

  @IsUUID()
  inspectorId: string;
}
