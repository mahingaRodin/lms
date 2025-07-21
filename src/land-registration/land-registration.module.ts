import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandRegistrationController } from './land-registration.controller';
import { LandRegistrationService } from './land-registration.service';
import { LandPlot } from 'src/entities/land-plot.entity';
import { LandOwner } from 'src/entities/land-owner.entity';
import { User } from 'src/entities/user.entity';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([LandPlot, LandOwner, User]), RedisModule],
  controllers: [LandRegistrationController],
  providers: [LandRegistrationService],
  exports: [LandRegistrationService],
})
export class LandRegistrationModule {}
