import { IsUUID, IsNotEmpty } from 'class-validator';

export class PayTaxDto {
  @IsUUID()
  @IsNotEmpty()
  taxRecordId: string;
}
