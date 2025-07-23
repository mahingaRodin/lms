import {
  Controller,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ConstructionService } from './construction.service';
import { CreatePermitDto } from './dto/create-permit.dto';
import { UpdatePermitStatusDto } from './dto/update-permit-status.dto';
import { ScheduleInspectionDto } from './dto/schedule-inspection.dto';
import { InspectionReportDto } from './dto/inspection-report.dto';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { UserRole } from 'src/entities/user.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Construction Permits')
@Controller('permits')
@UseGuards(JwtAuthGuard)
export class ConstructionController {
  constructor(private readonly constructionService: ConstructionService) {}

  @ApiOperation({ summary: 'Applying for land perit' })
  @ApiResponse({
    status: 201,
    description: 'Land plot successfully registered',
  })
  @Post()
  @Roles(UserRole.CITIZEN)
  async applyForPermit(@Req() req, @Body() createDto: CreatePermitDto) {
    return this.constructionService.applyForPermit(req.user.id, createDto);
  }

  @Patch(':id/status')
  @Roles(UserRole.URBAN_PLANNER)
  async updatePermitStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdatePermitStatusDto,
  ) {
    return this.constructionService.updatePermitStatus(id, updateDto);
  }

  @Post(':id/inspections')
  @Roles(UserRole.URBAN_PLANNER)
  async scheduleInspection(
    @Param('id') id: string,
    @Body() scheduleDto: ScheduleInspectionDto,
  ) {
    return this.constructionService.scheduleInspection(id, scheduleDto);
  }

  @Patch('inspections/:id/report')
  @Roles(UserRole.URBAN_PLANNER)
  async submitInspectionReport(
    @Param('id') id: string,
    @Body() reportDto: InspectionReportDto,
  ) {
    return this.constructionService.submitInspectionReport(id, reportDto);
  }
}
