import {
  Controller,
  Post,
  Body,
  Patch,
  Get,
  Param,
  UseGuards,
  Req,
  Request,
} from '@nestjs/common';
import { LandTransferService } from './land-transfer.service';
import { InitiateTransferDto } from './dto/initiate-transfer.dto';
import { ApproveTransferDto } from './dto/approve-transfer.dto';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserRole } from 'src/entities/user.entity';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('land-transfers')
@UseGuards(JwtAuthGuard)
export class LandTransferController {
  constructor(private readonly transferService: LandTransferService) {}

  @Post('transfer')
  async transferOwnership(
    @Body() dto: { landPlotId: string; newOwnerId: string },
    @Request() req,
  ) {
    return this.transferService.transferOwnership(dto, req.user.id);
  }

  @Get('pending')
  //   @Roles(UserRole.ADMIN)
  async getPendingTransfers() {
    return this.transferService.getPendingTransfers();
  }
}
