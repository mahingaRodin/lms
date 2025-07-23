import { IsString, IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class CreateDisputeDto {
  @IsUUID()
  @IsNotEmpty()
  landPlotId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
