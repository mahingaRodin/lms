import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConstructionController } from './construction.controller';
import { ConstructionService } from './construction.service';
import { ConstructionPermit } from 'src/entities/construction-permit.entity';
import { LandPlot } from 'src/entities/land-plot.entity';
import { User } from 'src/entities/user.entity';
import { Inspection } from 'src/entities/inspection.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConstructionPermit, LandPlot, User, Inspection]),
  ],
  controllers: [ConstructionController],
  providers: [ConstructionService],
})
export class ConstructionModule {}
