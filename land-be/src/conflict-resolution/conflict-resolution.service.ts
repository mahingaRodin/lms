import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';
import { DisputeResponseDto } from './dto/dispute-response.dto';
import { Dispute, DisputeStatus } from "src/entities/dispute.entity";
import { LandPlot } from "src/entities/land-plot.entity";
import { User } from "src/entities/user.entity";

@Injectable()
export class ConflictResolutionService {
  constructor(
    @InjectRepository(Dispute)
    private readonly disputeRepo: Repository<Dispute>,
    @InjectRepository(LandPlot)
    private readonly landPlotRepo: Repository<LandPlot>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createDispute(
    reporterId: string,
    createDto: CreateDisputeDto,
  ): Promise<DisputeResponseDto> {
    const landPlot = await this.landPlotRepo.findOne({
      where: { id: createDto.landPlotId },
    });
    if (!landPlot) {
      throw new Error('Land plot not found');
    }

    const reporter = await this.userRepo.findOne({
      where: { id: reporterId },
    });
    if (!reporter) {
      throw new Error('Reporter not found');
    }

    const dispute = this.disputeRepo.create({
      title: createDto.title,
      description: createDto.description,
      reporter,
      landPlot,
    });

    const savedDispute = await this.disputeRepo.save(dispute);
    return new DisputeResponseDto(savedDispute);
  }

  async updateDisputeStatus(
    disputeId: string,
    updateDto: UpdateDisputeDto,
  ): Promise<DisputeResponseDto> {
    const dispute = await this.disputeRepo.findOne({
      where: { id: disputeId },
      relations: ['landPlot', 'reporter'],
    });

    if (!dispute) {
      throw new Error('Dispute not found');
    }

    if (updateDto.status) {
      dispute.status = updateDto.status;
    }

    if (updateDto.resolutionNotes) {
      dispute.resolutionNotes = updateDto.resolutionNotes;
    }

    const updatedDispute = await this.disputeRepo.save(dispute);
    return new DisputeResponseDto(updatedDispute);
  }

  async getActiveDisputes(): Promise<DisputeResponseDto[]> {
    const disputes = await this.disputeRepo.find({
      where: { status: DisputeStatus.PENDING },
      relations: ['landPlot', 'reporter'],
    });
    return disputes.map((d) => new DisputeResponseDto(d));
  }

  async getUserDisputes(userId: string): Promise<DisputeResponseDto[]> {
    const disputes = await this.disputeRepo.find({
      where: { reporter: { id: userId } },
      relations: ['landPlot'],
    });
    return disputes.map((d) => new DisputeResponseDto(d));
  }
}
