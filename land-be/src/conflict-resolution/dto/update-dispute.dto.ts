import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DisputeStatus } from '../../entities/dispute.entity';

export class UpdateDisputeDto {
  @IsOptional()
  @IsEnum(DisputeStatus)
  status?: DisputeStatus;

  @IsOptional()
  @IsString()
  resolutionNotes?: string;
}
