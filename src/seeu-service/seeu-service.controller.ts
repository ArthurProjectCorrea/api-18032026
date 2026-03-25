import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  SeeuServiceService,
  CreateSeeuServiceDto,
} from './seeu-service.service';
import { AuthGuard } from '@/auth/auth.guard';
import type { AuthenticatedRequest } from '@/auth/auth.guard';

@Controller('admin/seeu-service')
@UseGuards(AuthGuard)
export class SeeuServiceController {
  constructor(private readonly seeuServiceService: SeeuServiceService) {}

  @Post()
  create(
    @Body() createDto: Omit<CreateSeeuServiceDto, 'created_by'>,
    @Req() req: AuthenticatedRequest,
  ) {
    const user_id = req.user?.uid;
    return this.seeuServiceService.create({
      ...createDto,
      created_by: user_id as string,
    });
  }

  @Get('check-monthly')
  async checkMonthly(
    @Query('cpf') cpf: string,
    @Query('lawsuit') lawsuit: string,
  ) {
    if (!cpf || !lawsuit) return { hasSignatureThisMonth: false };
    const hasSignatureThisMonth =
      await this.seeuServiceService.checkMonthlySignature(cpf, lawsuit);
    return { hasSignatureThisMonth };
  }

  @Get()
  findAll() {
    return this.seeuServiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seeuServiceService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const user_id = req.user?.uid || 'system';
    return this.seeuServiceService.softDelete(id, user_id);
  }
}
