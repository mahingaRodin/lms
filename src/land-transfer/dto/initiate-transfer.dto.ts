import { IsUUID, IsNotEmpty } from 'class-validator';

export class InitiateTransferDto {
  @IsUUID()
  @IsNotEmpty()
  landPlotId: string;

  @IsUUID()
  @IsNotEmpty()
  newOwnerId: string;
}
