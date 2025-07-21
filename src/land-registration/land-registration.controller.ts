import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { LandRegistrationService } from './land-registration.service';
import { CreateLandPlotDto } from './dto/create-land-plot.dto';
import { RegisterOwnerDto } from './dto/register-owner.dto';
import { UserRole } from "src/entities/user.entity";
import { RolesGuard } from "src/guard/roles.guard";
import { JwtAuthGuard } from "src/guard/jwt.guard";
import { Roles } from "src/decorators/roles.decorator";

@Controller('land-plots')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LandRegistrationController {
  constructor(
    private readonly landRegistrationService: LandRegistrationService,
  ) {}

  @Post('register')
//   @Roles(UserRole.ADMIN, UserRole.URBAN_PLANNER)
  async create(@Body() createLandPlotDto: CreateLandPlotDto) {
    return this.landRegistrationService.registerLandPlot(createLandPlotDto);
  }

  @Post(':id/owners')
//   @Roles(UserRole.ADMIN, UserRole.URBAN_PLANNER)
  async addOwner(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() registerOwnerDto: RegisterOwnerDto,
  ) {
    return this.landRegistrationService.addOwnerToPlot(id, registerOwnerDto);
  }

  @Get(':id')
//   @Roles(
//     UserRole.ADMIN,
//     UserRole.URBAN_PLANNER,
//     UserRole.TAX_OFFICER,
//     UserRole.CITIZEN,
//   )
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.landRegistrationService.getLandPlotById(id);
  }

  @Get()
//   @Roles(UserRole.ADMIN, UserRole.URBAN_PLANNER, UserRole.TAX_OFFICER)
  async findAll() {
    return this.landRegistrationService.getAllLandPlots();
  }
}
