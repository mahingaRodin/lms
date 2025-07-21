import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ConflictResolutionService } from './conflict-resolution.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { UserRole } from 'src/entities/user.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Conflict Resolution')
@Controller('disputes')
@UseGuards(JwtAuthGuard)
export class ConflictResolutionController {
  constructor(private readonly conflictService: ConflictResolutionService) {}

  @ApiOperation({ summary: 'Create Dispute' })
  @ApiResponse({
    status: 201,
    description: 'Dispute successfully registered',
  })
  @Post()
  @Roles(UserRole.CITIZEN)
  async createDispute(@Req() req, @Body() createDto: CreateDisputeDto) {
    return this.conflictService.createDispute(req.user.id, createDto);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  async updateDisputeStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateDisputeDto,
  ) {
    return this.conflictService.updateDisputeStatus(id, updateDto);
  }

  @Get('active')
  @Roles(UserRole.ADMIN, UserRole.CITIZEN)
  async getActiveDisputes() {
    return this.conflictService.getActiveDisputes();
  }

  @Get('my-disputes')
  @Roles(UserRole.CITIZEN)
  async getUserDisputes(@Req() req) {
    return this.conflictService.getUserDisputes(req.user.id);
  }
}
