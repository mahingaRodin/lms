export class SettingsResponseDto {
  taxRates: Record<string, number>;
  permitWorkflow: {
    steps: string[];
    requiredDocuments: string[];
  };
  updatedAt: Date;
}
