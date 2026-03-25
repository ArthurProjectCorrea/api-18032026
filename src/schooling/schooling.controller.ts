import { Controller, Get, UseGuards } from '@nestjs/common';
import { SchoolingService } from './schooling.service';
import { AuthGuard } from '@/auth/auth.guard';

@Controller('admin/schooling')
@UseGuards(AuthGuard)
export class SchoolingController {
  constructor(private readonly schoolingService: SchoolingService) {}

  @Get()
  findAll() {
    return this.schoolingService.findAll();
  }
}
