import { IsEnum } from 'class-validator';
import { PermitStatus } from '../../entities/construction-permit.entity';

export class UpdatePermitStatusDto {
  @IsEnum(PermitStatus)
  status: PermitStatus;
}
