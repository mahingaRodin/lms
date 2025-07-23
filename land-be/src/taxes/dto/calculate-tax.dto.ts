export class CalculateTaxDto {
  landPlotId: string;
  parcelNumber: string;
  areaHectares: number;
  taxYear: number;
  taxAmount: number;
  dueDate: Date | null;
  isPaid: boolean;
}
