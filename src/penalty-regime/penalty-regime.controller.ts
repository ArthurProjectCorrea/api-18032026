import { Controller, Get, UseGuards } from '@nestjs/common';
import { PenaltyRegimeService } from './penalty-regime.service';
import { AuthGuard } from '@/auth/auth.guard';

@Controller('admin/penalty-regime')
@UseGuards(AuthGuard)
export class PenaltyRegimeController {
  constructor(private readonly penaltyRegimeService: PenaltyRegimeService) {}

  @Get()
  findAll() {
    return this.penaltyRegimeService.findAll();
  }
}
