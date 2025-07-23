import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermitDto } from './dto/create-permit.dto';
import { PermitResponseDto } from './dto/permit-response.dto';
import { ScheduleInspectionDto } from './dto/schedule-inspection.dto';
import { InspectionReportDto } from './dto/inspection-report.dto';
import { ConstructionPermit } from 'src/entities/construction-permit.entity';
import { LandPlot } from 'src/entities/land-plot.entity';
import { User } from 'src/entities/user.entity';
import { Inspection } from 'src/entities/inspection.entity';
import { UpdatePermitStatusDto } from './dto/update-permit-status.dto';

@Injectable()
export class ConstructionService {
  constructor(
    @InjectRepository(ConstructionPermit)
    private readonly permitRepo: Repository<ConstructionPermit>,
    @InjectRepository(LandPlot)
    private readonly landPlotRepo: Repository<LandPlot>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Inspection)
    private readonly inspectionRepo: Repository<Inspection>,
  ) {}

  async applyForPermit(applicantId: string, createDto: CreatePermitDto) {
    const landPlot = await this.landPlotRepo.findOne({
      where: { id: createDto.landPlotId },
      relations: {
        owners: {
          user: true,
        },
      },
    });

    if (!landPlot) throw new NotFoundException('Land plot not found');

    const validOwners = landPlot.owners.filter((owner) => owner.user !== null);
    const isOwner = validOwners.some(
      (owner) =>
        owner.user.id === applicantId && owner.ownershipEndDate === null,
    );

    if (!isOwner) {
      throw new ForbiddenException({
        message: 'Ownership verification failed',
        requiredUserId: applicantId,
        validOwners: validOwners.map((o) => ({
          userId: o.user.id,
          status: o.ownershipEndDate ? 'past' : 'current',
        })),
      });
    }

    const existingPermit = await this.permitRepo.findOne({
      where: { landPlot: { id: createDto.landPlotId } },
    });

    if (existingPermit) {
      throw new ConflictException(
        'This land plot already has an active permit',
      );
    }

    const permit = this.permitRepo.create({
      buildingPlanFileName: createDto.buildingPlanFileName,
      applicant: { id: applicantId },
      landPlot: { id: createDto.landPlotId },
    });

    return new PermitResponseDto(await this.permitRepo.save(permit));
  }

  async updatePermitStatus(
    permitId: string,
    updateDto: UpdatePermitStatusDto,
  ): Promise<PermitResponseDto> {
    await this.permitRepo.update(permitId, {
      status: updateDto.status,
    });

    return this.getPermitById(permitId);
  }

  async scheduleInspection(
    permitId: string,
    scheduleDto: ScheduleInspectionDto,
  ): Promise<PermitResponseDto> {
    const inspector = await this.userRepo.findOne({
      where: { id: scheduleDto.inspectorId },
    });

    if (!inspector) {
      throw new Error('Inspector not found');
    }

    const inspection = this.inspectionRepo.create({
      scheduledDate: scheduleDto.scheduledDate,
      permit: { id: permitId },
      inspector: { id: scheduleDto.inspectorId },
    });

    await this.inspectionRepo.save(inspection);
    return this.getPermitById(permitId);
  }

  async submitInspectionReport(
    inspectionId: string,
    reportDto: InspectionReportDto,
  ): Promise<PermitResponseDto> {
    const inspection = await this.inspectionRepo.findOne({
      where: { id: inspectionId },
      relations: ['permit'],
    });

    if (!inspection) {
      throw new Error('Inspection not found');
    }

    await this.inspectionRepo.update(inspectionId, {
      report: reportDto.report,
      actualDate: new Date(),
    });

    return this.getPermitById(inspection.permit.id);
  }

  async getPermitById(id: string): Promise<PermitResponseDto> {
    const permit = await this.permitRepo.findOneOrFail({
      where: { id },
      relations: ['landPlot', 'inspections', 'inspections.inspector'],
    });
    return new PermitResponseDto(permit);
  }
}
