import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ScreensService } from './screens.service';
import { AuthGuard } from '@/auth/auth.guard';
import { PermissionsGuard } from '@/auth/permissions.guard';

@Controller('screens')
@UseGuards(AuthGuard, PermissionsGuard)
export class ScreensController {
  constructor(private readonly screensService: ScreensService) {}

  @Get()
  findAll() {
    return this.screensService.findAll();
  }

  @Get('key/:key')
  findOneByKey(@Param('key') key: string) {
    return this.screensService.findOneByKey(key);
  }
}
