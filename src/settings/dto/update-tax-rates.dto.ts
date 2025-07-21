import { IsNumber, IsPositive, IsOptional } from 'class-validator';

export class UpdateTaxRatesDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  residential?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  commercial?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  agricultural?: number;
}
