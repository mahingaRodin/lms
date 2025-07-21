import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLandPlotDto } from './dto/create-land-plot.dto';
import { RegisterOwnerDto } from './dto/register-owner.dto';
import { LandPlot } from 'src/entities/land-plot.entity';
import { LandOwner } from 'src/entities/land-owner.entity';
import { LandPlotResponseDto } from './dto/land-response.dto';
import { OwnerResponseDto } from './dto/owner-response.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class LandRegistrationService {
  constructor(
    @InjectRepository(LandPlot)
    private readonly landPlotRepository: Repository<LandPlot>,
    @InjectRepository(LandOwner)
    private readonly landOwnerRepository: Repository<LandOwner>,
  ) {}

  async registerLandPlot(
    createDto: CreateLandPlotDto,
  ): Promise<LandPlotResponseDto> {
    const landPlot = this.landPlotRepository.create(createDto);
    const savedPlot = await this.landPlotRepository.save(landPlot);

    const fullPlot = await this.landPlotRepository.findOne({
      where: { id: savedPlot.id },
      relations: ['owners', 'owners.user'],
    });

    const transformedOwners: OwnerResponseDto[] =
      fullPlot?.owners?.map((owner) => ({
        userId: owner.user?.id,
        ownershipStartDate: owner.ownershipStartDate,
        ownershipEndDate: owner.ownershipEndDate,
        ownershipType: owner.ownershipType,
      })) ?? [];

    const response: LandPlotResponseDto = new LandPlotResponseDto({
      id: fullPlot?.id,
      parcelNumber: fullPlot?.parcelNumber,
      areaHectares: fullPlot?.areaHectares,
      address: fullPlot?.address,
      owners: transformedOwners,
    });

    return response;
  }

  async addOwnerToPlot(
    plotId: string,
    ownerDto: RegisterOwnerDto,
  ): Promise<LandPlotResponseDto> {
    const landPlot = await this.landPlotRepository.findOne({
      where: { id: plotId },
    });
    if (!landPlot) {
      throw new Error('Land plot not found');
    }

    const owner = this.landOwnerRepository.create({
      ...ownerDto,
      landPlot,
    });

    await this.landOwnerRepository.save(owner);
    return this.getLandPlotById(plotId);
  }

  async getLandPlotById(id: string): Promise<LandPlotResponseDto> {
    const landPlot = await this.landPlotRepository.findOne({
      where: { id },
      relations: ['owners', 'owners.user'],
    });

    if (!landPlot) {
      throw new NotFoundException(`Land plot with ID ${id} not found`);
    }

    const transformedOwners = landPlot.owners.map((owner) => ({
      userId: owner.user?.id,
      ownershipStartDate: owner.ownershipStartDate,
      ownershipEndDate: owner.ownershipEndDate,
      ownershipType: owner.ownershipType,
    }));

    return new LandPlotResponseDto({
      id: landPlot.id,
      parcelNumber: landPlot.parcelNumber,
      areaHectares: landPlot.areaHectares,
      address: landPlot.address,
      owners: transformedOwners,
    });
  }

  async getAllLandPlots(): Promise<LandPlotResponseDto[]> {
    const landPlots = await this.landPlotRepository.find({
      relations: ['owners', 'owners.user'],
    });

    return landPlots.map((plot) => {
      const owners: OwnerResponseDto[] = plot.owners.map((owner) => ({
        userId: owner.user?.id,
        ownershipStartDate: owner.ownershipStartDate,
        ownershipEndDate: owner.ownershipEndDate,
        ownershipType: owner.ownershipType,
      }));

      return new LandPlotResponseDto({
        id: plot.id,
        parcelNumber: plot.parcelNumber,
        areaHectares: plot.areaHectares,
        address: plot.address,
        owners,
      });
    });
  }
}
