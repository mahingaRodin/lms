import { Expose } from 'class-transformer';

export class TransferResponseDto {
  @Expose()
  id: string;

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  landPlot: { id: string; parcelNumber: string };

  @Expose()
  currentOwner: { id: string; fullName: string };

  @Expose()
  newOwner: { id: string; fullName: string };

  @Expose()
  adminNotes?: string;
}
