import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandRegistrationController } from './land-registration.controller';
import { LandRegistrationService } from './land-registration.service';
import { LandPlot } from "src/entities/land-plot.entity";
import { LandOwner } from "src/entities/land-owner.entity";
import { User } from "src/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([LandPlot, LandOwner, User])],
  controllers: [LandRegistrationController],
  providers: [LandRegistrationService],
  exports: [LandRegistrationService],
})
export class LandRegistrationModule {}
