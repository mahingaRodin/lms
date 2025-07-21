export class OwnerResponseDto {
  userId: string;
  ownershipStartDate: Date;
  ownershipEndDate: Date | null;
  ownershipType: string;
}
