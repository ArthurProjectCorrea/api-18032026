import {
  Controller,
  Get,
  Param,
  UseGuards,
  Patch,
  Body,
  Query,
} from '@nestjs/common';
import { ScreensService } from './screens.service';
import { AuthGuard } from '@/auth/auth.guard';

@Controller('admin/screens')
@UseGuards(AuthGuard)
export class ScreensController {
  constructor(private readonly screensService: ScreensService) {}

  @Get()
  findAll(@Query('all') all?: string) {
    return this.screensService.findAll(all === 'true');
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('name') name: string) {
    return this.screensService.update(+id, name);
  }

  @Get('key/:key')
  findOneByKey(@Param('key') key: string) {
    return this.screensService.findOneByKey(key);
  }
}
