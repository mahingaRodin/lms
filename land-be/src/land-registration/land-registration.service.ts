import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLandPlotDto } from './dto/create-land-plot.dto';
import { RegisterOwnerDto } from './dto/register-owner.dto';
import { LandPlot } from '../entities/land-plot.entity';
import { LandOwner } from '../entities/land-owner.entity';
import { LandPlotResponseDto } from './dto/land-response.dto';
import { OwnerResponseDto } from './dto/owner-response.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Polygon } from 'geojson';

@Injectable()
export class LandRegistrationService {
  constructor(
    @InjectRepository(LandPlot)
    private readonly landPlotRepository: Repository<LandPlot>,
    @InjectRepository(LandOwner)
    private readonly landOwnerRepository: Repository<LandOwner>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async registerLandPlot(
    createDto: CreateLandPlotDto,
  ): Promise<LandPlotResponseDto> {
    this.validatePolygon(createDto.boundary);

    const addressArr = [
      createDto.province,
      createDto.district,
      createDto.sector,
      createDto.cell,
      createDto.village,
    ];

    const address = addressArr.join('/');

    const landPlot = this.landPlotRepository.create({ ...createDto, address });
    const savedPlot = await this.landPlotRepository.save(landPlot);

    const fullPlot = await this.landPlotRepository.findOne({
      where: { id: savedPlot.id },
      relations: ['owners', 'owners.user'],
    });

    if (!fullPlot) {
      throw new NotFoundException('Land plot not found after creation');
    }

    const transformedOwners: OwnerResponseDto[] =
      fullPlot.owners?.map((owner) => ({
        userId: owner.user?.id,
        ownershipStartDate: owner.ownershipStartDate,
        ownershipEndDate: owner.ownershipEndDate,
        ownershipType: owner.ownershipType,
      })) ?? [];

    const response = new LandPlotResponseDto({
      id: fullPlot.id,
      parcelNumber: fullPlot.parcelNumber,
      areaHectares: fullPlot.areaHectares,
      boundary: fullPlot.boundary,
      address: fullPlot.address,
      createdAt: fullPlot.createdAt,
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
      throw new NotFoundException('Land plot not found');
    }

    const owner = this.landOwnerRepository.create({
      ...ownerDto,
      landPlot,
    });

    await this.landOwnerRepository.save(owner);
    return this.getLandPlotById(plotId);
  }

  async getLandPlotById(id: string): Promise<LandPlotResponseDto> {
    const cacheKey = `landplot:${id}`;

    const cachedData =
      await this.cacheManager.get<LandPlotResponseDto>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

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

    const response = new LandPlotResponseDto({
      id: landPlot.id,
      parcelNumber: landPlot.parcelNumber,
      areaHectares: landPlot.areaHectares,
      boundary: landPlot.boundary,
      createdAt: landPlot.createdAt,
      owners: transformedOwners,
    });

    const ttl = process.env.REDIS_TTL
      ? parseInt(process.env.REDIS_TTL, 10)
      : 3600;
    await this.cacheManager.set(cacheKey, response, ttl);

    return response;
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
        boundary: plot.boundary,
        createdAt: plot.createdAt,
        owners,
      });
    });
  }

  // PostGIS-specific methods
  async findPlotsWithinRadius(
    lat: number,
    lng: number,
    radiusKm: number,
  ): Promise<LandPlotResponseDto[]> {
    const plots = await this.landPlotRepository
      .createQueryBuilder('plot')
      .where(
        `ST_DWithin(
          plot.boundary,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
          :radius
        )`,
        { lat, lng, radius: radiusKm * 1000 },
      )
      .leftJoinAndSelect('plot.owners', 'owners')
      .leftJoinAndSelect('owners.user', 'user')
      .getMany();

    return plots.map((plot) => this.mapToResponseDto(plot));
  }

  async findPlotsContainingPoint(
    lat: number,
    lng: number,
  ): Promise<LandPlotResponseDto[]> {
    const plots = await this.landPlotRepository
      .createQueryBuilder('plot')
      .where(
        `ST_Contains(
          plot.boundary,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)
        )`,
        { lat, lng },
      )
      .leftJoinAndSelect('plot.owners', 'owners')
      .leftJoinAndSelect('owners.user', 'user')
      .getMany();

    return plots.map((plot) => this.mapToResponseDto(plot));
  }

  async calculatePlotArea(id: string): Promise<number> {
    const result = await this.landPlotRepository
      .createQueryBuilder('plot')
      .select('ST_Area(plot.boundary::geography)', 'area')
      .where('plot.id = :id', { id })
      .getRawOne();

    return parseFloat(result.area);
  }

  private validatePolygon(polygon: Polygon): void {
    if (!polygon || polygon.type !== 'Polygon' || !polygon.coordinates) {
      throw new Error('Invalid Polygon format');
    }

    // Validate the polygon is closed (first and last points are the same)
    const [firstRing] = polygon.coordinates;
    const [firstPoint] = firstRing;
    const lastPoint = firstRing[firstRing.length - 1];

    if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
      throw new Error(
        'Polygon must be closed (first and last points must be equal)',
      );
    }

    // Validate at least 4 points (a closed polygon needs at least 3 distinct points + closing point)
    if (firstRing.length < 4) {
      throw new Error('Polygon must have at least 3 distinct points');
    }
  }

  private mapToResponseDto(plot: LandPlot): LandPlotResponseDto {
    const owners: OwnerResponseDto[] =
      plot.owners?.map((owner) => ({
        userId: owner.user?.id,
        ownershipStartDate: owner.ownershipStartDate,
        ownershipEndDate: owner.ownershipEndDate,
        ownershipType: owner.ownershipType,
      })) || [];

    return new LandPlotResponseDto({
      id: plot.id,
      parcelNumber: plot.parcelNumber,
      areaHectares: plot.areaHectares,
      boundary: plot.boundary,
      createdAt: plot.createdAt,
      owners,
    });
  }
}
