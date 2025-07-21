import { Controller, Put, Get, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateTaxRatesDto } from './dto/update-tax-rates.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { JwtAuthGuard } from "src/guard/jwt.guard";
import { RolesGuard } from "src/guard/roles.guard";
import { UserRole } from "src/entities/user.entity";
import { Roles } from "src/decorators/roles.decorator";


@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Put('tax-rates')
  @Roles(UserRole.ADMIN)
  async updateTaxRates(@Body() dto: UpdateTaxRatesDto) {
    return this.settingsService.updateTaxRates(dto);
  }

  @Put('workflow')
  @Roles(UserRole.ADMIN)
  async updateWorkflow(@Body() dto: UpdateWorkflowDto) {
    return this.settingsService.updateWorkflow(dto);
  }

  @Get('roles')
  @Roles(UserRole.ADMIN)
  async getRolesAndPermissions() {
    return this.settingsService.getSettings();
  }
}
