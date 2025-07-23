import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalculateTaxDto } from './dto/calculate-tax.dto';
import { TaxRecordResponseDto } from './dto/tax-record-response.dto';
import { TaxRecord } from 'src/entities/tax-record.entity';
import { LandPlot } from 'src/entities/land-plot.entity';
import { User } from 'src/entities/user.entity';
import { RabbitMQService } from "src/rabbitmq/rabbitmq.service";
import { NotificationService } from "src/notification/notification.service";

@Injectable()
export class TaxesService {
  constructor(
    @InjectRepository(TaxRecord)
    private readonly taxRecordRepo: Repository<TaxRecord>,
    @InjectRepository(LandPlot)
    private readonly landPlotRepo: Repository<LandPlot>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private rabbitMQ: RabbitMQService,
    private notificationService: NotificationService,
  ) {}

  async calculateTaxForPlot(plotId: string): Promise<CalculateTaxDto> {
    const plot = await this.landPlotRepo.findOne({
      where: { id: plotId },
      relations: ['taxRecords'],
    });

    if (!plot) {
      throw new Error('Land plot not found');
    }

    const currentYear = new Date().getFullYear();
    const existingTax = plot.taxRecords.find(
      (tax) => tax.dueDate.getFullYear() === currentYear,
    );

    if (existingTax) {
      return {
        landPlotId: plot.id,
        parcelNumber: plot.parcelNumber,
        areaHectares: plot.areaHectares,
        taxYear: currentYear,
        taxAmount: existingTax.amount,
        dueDate: existingTax.dueDate,
        isPaid: existingTax.isPaid,
      };
    }

    await this.rabbitMQ.publishToQueue('tax_calculations', {
      plotId,
      areaHectares: plot.areaHectares,
      currentYear,
      requestedAt: new Date(),
    });

    return {
      landPlotId: plot.id,
      parcelNumber: plot.parcelNumber,
      areaHectares: plot.areaHectares,
      taxYear: currentYear,
      taxAmount: 0,
      dueDate: null,
      isPaid: false,
    };
  }

  private async processTaxCalculation(message: {
    plotId: string;
    areaHectares: number;
    currentYear: number;
  }) {
    const taxAmount = message.areaHectares * 1000;
    const dueDate = new Date(message.currentYear, 11, 31);

    const newTax = this.taxRecordRepo.create({
      amount: taxAmount,
      dueDate,
      isPaid: false,
      landPlot: { id: message.plotId },
    });

    await this.taxRecordRepo.save(newTax);

    await this.notificationService.sendTaxCalculationComplete(
      message.plotId,
      taxAmount,
      dueDate,
    );
  }

  async payTax(taxRecordId: string): Promise<TaxRecordResponseDto> {
    const taxRecord = await this.taxRecordRepo.findOne({
      where: { id: taxRecordId },
      relations: ['landPlot'],
    });

    if (!taxRecord) {
      throw new Error('Tax record not found');
    }

    taxRecord.isPaid = true;
    const updatedRecord = await this.taxRecordRepo.save(taxRecord);
    return new TaxRecordResponseDto(updatedRecord);
  }

  async getUnpaidTaxes(): Promise<TaxRecordResponseDto[]> {
    const unpaidTaxes = await this.taxRecordRepo.find({
      where: { isPaid: false },
      relations: ['landPlot'],
    });

    return unpaidTaxes.map((tax) => new TaxRecordResponseDto(tax));
  }

  async getUserTaxRecords(userId: string): Promise<TaxRecordResponseDto[]> {
    const ownedPlots = await this.landPlotRepo.find({
      where: { owners: { user: { id: userId } } },
      relations: ['taxRecords'],
    });

    const allTaxRecords = ownedPlots.flatMap((plot) => plot.taxRecords);
    return allTaxRecords.map((tax) => new TaxRecordResponseDto(tax));
  }
}
