import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TransferStatus } from "src/entities/land-transfer.entity";

export class ApproveTransferDto {
  @IsEnum(TransferStatus)
  status: TransferStatus;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
