import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class RegisterOwnerDto {
  @IsString()
  userId: string;

  @IsDateString()
  ownershipStartDate: Date;

  @IsOptional()
  @IsDateString()
  ownershipEndDate?: Date;

  @IsEnum(['freehold', 'leasehold', 'customary'])
  ownershipType: 'freehold' | 'leasehold' | 'customary';
}
