import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandTransferController } from './land-transfer.controller';
import { LandTransferService } from './land-transfer.service';
import { LandTransfer } from "src/entities/land-transfer.entity";
import { LandOwner } from "src/entities/land-owner.entity";
import { User } from "src/entities/user.entity";
import { LandPlot } from "src/entities/land-plot.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([LandTransfer, LandOwner, User, LandPlot]),
  ],
  controllers: [LandTransferController],
  providers: [LandTransferService],
})
export class LandTransferModule {}
