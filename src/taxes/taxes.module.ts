import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxesController } from './taxes.controller';
import { TaxesService } from './taxes.service';
import { TaxRecord } from 'src/entities/tax-record.entity';
import { LandPlot } from 'src/entities/land-plot.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaxRecord, LandPlot, User])],
  controllers: [TaxesController],
  providers: [TaxesService],
})
export class TaxesModule {}
