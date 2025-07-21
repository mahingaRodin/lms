import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateWorkflowDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  steps?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredDocuments?: string[];
}
