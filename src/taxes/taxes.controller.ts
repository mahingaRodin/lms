// src/modules/taxes/taxes.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TaxesService } from './taxes.service';
import { PayTaxDto } from './dto/pay-tax.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { UserRole } from 'src/entities/user.entity';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('taxes')
@UseGuards(JwtAuthGuard)
export class TaxesController {
  constructor(private readonly taxesService: TaxesService) {}

  @Get('plot/:plotId')
  @Roles(UserRole.TAX_OFFICER, UserRole.CITIZEN)
  async calculateTax(@Param('plotId') plotId: string) {
    return this.taxesService.calculateTaxForPlot(plotId);
  }

  @Post('pay')
  @Roles(UserRole.CITIZEN)
  async payTax(@Body() dto: PayTaxDto) {
    return this.taxesService.payTax(dto.taxRecordId);
  }

  @Get('unpaid')
  @Roles(UserRole.TAX_OFFICER)
  async getUnpaidTaxes() {
    return this.taxesService.getUnpaidTaxes();
  }

  @Get('my-taxes')
  @Roles(UserRole.CITIZEN)
  async getUserTaxes(@Req() req) {
    return this.taxesService.getUserTaxRecords(req.user.id);
  }
}
