import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConflictResolutionController } from './conflict-resolution.controller';
import { ConflictResolutionService } from './conflict-resolution.service';
import { LandPlot } from 'src/entities/land-plot.entity';
import { User } from 'src/entities/user.entity';
import { Dispute } from 'src/entities/dispute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dispute, LandPlot, User])],
  controllers: [ConflictResolutionController],
  providers: [ConflictResolutionService],
})
export class ConflictResolutionModule {}
