import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxesController } from './taxes.controller';
import { TaxesService } from './taxes.service';
import { TaxRecord } from 'src/entities/tax-record.entity';
import { LandPlot } from 'src/entities/land-plot.entity';
import { User } from 'src/entities/user.entity';
import { NotificationService } from 'src/notification/notification.service';
import { RabbitMQModule } from "src/rabbitmq/rabbitmq.module";

@Module({
  imports: [TypeOrmModule.forFeature([TaxRecord, LandPlot, User]),
  RabbitMQModule
  ],
  controllers: [TaxesController],
  providers: [TaxesService, NotificationService],
})
export class TaxesModule {}
