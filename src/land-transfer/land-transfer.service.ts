import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { InitiateTransferDto } from './dto/initiate-transfer.dto';
import { ApproveTransferDto } from './dto/approve-transfer.dto';
import { TransferResponseDto } from './dto/transfer-response.dto';
import {
  LandTransfer,
  TransferStatus,
} from 'src/entities/land-transfer.entity';
import { LandOwner } from 'src/entities/land-owner.entity';
import { User } from 'src/entities/user.entity';
import { LandPlot } from 'src/entities/land-plot.entity';

@Injectable()
export class LandTransferService {
  constructor(
    @InjectRepository(LandTransfer)
    private readonly transferRepo: Repository<LandTransfer>,

    @InjectRepository(LandOwner)
    private readonly ownerRepo: Repository<LandOwner>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(LandPlot)
    private readonly plotRepo: Repository<LandPlot>,
  ) {}

  async initiateTransfer(
    currentOwnerId: string,
    dto: InitiateTransferDto,
  ): Promise<void> {
    const isOwner = await this.ownerRepo.findOne({
      where: {
        user: { id: currentOwnerId },
        landPlot: { id: dto.landPlotId },
        ownershipEndDate: IsNull(),
      },
    });

    if (!isOwner) {
      throw new Error('You are not the current owner of this land plot');
    }

    const newOwner = await this.userRepo.findOne({
      where: { id: dto.newOwnerId },
    });

    if (!newOwner) {
      throw new Error('New owner not found');
    }

    const transfer = this.transferRepo.create({
      currentOwner: { id: currentOwnerId },
      newOwner: { id: dto.newOwnerId },
      landPlot: { id: dto.landPlotId },
      status: TransferStatus.PENDING,
    });

    await this.transferRepo.save(transfer);
  }

  async transferOwnership(
    dto: { landPlotId: string; newOwnerId: string },
    currentUserId: string,
  ): Promise<void> {
    await this.plotRepo.manager.transaction(async (manager) => {
      const currentOwner = await manager.findOne(LandOwner, {
        where: {
          landPlot: { id: dto.landPlotId },
          user: { id: currentUserId },
          ownershipEndDate: IsNull(),
        },
      });

      if (!currentOwner) {
        throw new ForbiddenException('You do not own this land plot');
      }

      const newOwnerExists = await manager.exists(User, {
        where: { id: dto.newOwnerId },
      });
      if (!newOwnerExists) {
        throw new NotFoundException('New owner not found');
      }
      await manager.update(
        LandOwner,
        { id: currentOwner.id },
        { ownershipEndDate: new Date() },
      );

      await manager.save(LandOwner, {
        landPlot: { id: dto.landPlotId },
        user: { id: dto.newOwnerId },
        ownershipStartDate: new Date(),
        ownershipType: currentOwner.ownershipType,
      });
    });
  }
  private async processOwnershipTransfer(
    plotId: string,
    currentOwnerId: string,
    newOwnerId: string,
  ): Promise<void> {
    await this.ownerRepo
      .createQueryBuilder()
      .update()
      .set({ ownershipEndDate: new Date() })
      .where('landPlotId = :plotId', { plotId })
      .andWhere('userId = :currentOwnerId', { currentOwnerId })
      .andWhere('ownershipEndDate IS NULL')
      .execute();
    await this.ownerRepo.insert({
      landPlot: { id: plotId },
      user: { id: newOwnerId },
      ownershipStartDate: new Date(),
      ownershipType: 'freehold',
    });
  }

  async getPendingTransfers(): Promise<TransferResponseDto[]> {
    const transfers = await this.transferRepo.find({
      where: { status: TransferStatus.PENDING },
      relations: ['landPlot', 'currentOwner', 'newOwner'],
    });

    return transfers.map((t) => {
      return {
        id: t.id,
        status: t.status,
        adminNotes: t.adminNotes,
        createdAt: t.createdAt,
        landPlot: t.landPlot,
        currentOwner: t.currentOwner,
        newOwner: t.newOwner,
      } as TransferResponseDto;
    });
  }
}
