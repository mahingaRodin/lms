import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateTaxRatesDto } from './dto/update-tax-rates.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { SettingsResponseDto } from './dto/settings-response.dto';
import { SystemSettings } from "src/entities/system-settings.entity";

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SystemSettings)
    private readonly settingsRepo: Repository<SystemSettings>,
  ) {}

  async updateTaxRates(
    updateDto: UpdateTaxRatesDto,
  ): Promise<SettingsResponseDto> {
    const settings = await this.getOrCreateSettings();
    settings.taxRates = { ...settings.taxRates, ...updateDto };
    settings.updatedAt = new Date();
    return this.toDto(await this.settingsRepo.save(settings));
  }

  async updateWorkflow(
    updateDto: UpdateWorkflowDto,
  ): Promise<SettingsResponseDto> {
    const settings = await this.getOrCreateSettings();
    settings.permitWorkflow = {
      ...settings.permitWorkflow,
      ...updateDto,
    };
    settings.updatedAt = new Date();
    return this.toDto(await this.settingsRepo.save(settings));
  }

  async getSettings(): Promise<SettingsResponseDto> {
    return this.toDto(await this.getOrCreateSettings());
  }

  private async getOrCreateSettings(): Promise<SystemSettings> {
    let settings = await this.settingsRepo.findOne({
      where: { id: 'default' },
    });
    if (!settings) {
      settings = this.settingsRepo.create();
      await this.settingsRepo.save(settings);
    }
    return settings;
  }

  private toDto(settings: SystemSettings): SettingsResponseDto {
    return {
      taxRates: settings.taxRates,
      permitWorkflow: settings.permitWorkflow,
      updatedAt: settings.updatedAt,
    };
  }
}
