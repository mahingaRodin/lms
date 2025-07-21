import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { TaxesService } from './taxes.service';
import { PayTaxDto } from './dto/pay-tax.dto';
import { Request } from 'express';
import { JwtAuthGuard } from "src/guard/jwt.guard";
import { User, UserRole } from "src/entities/user.entity";
import { Roles } from "src/decorators/roles.decorator";

interface RequestWithUser extends Request {
  user: User;
}

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
  async getUserTaxes(@Req() req: Request) {
    const { user } = req as RequestWithUser;

    if (!user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.taxesService.getUserTaxRecords(user.id);
  }
}
