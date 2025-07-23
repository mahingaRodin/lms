import { Expose } from 'class-transformer';

export class InspectionResponseDto {
  @Expose()
  id: string;

  @Expose()
  scheduledDate: Date;

  @Expose()
  inspector: {
    id: string;
    fullName: string;
  };
}
