import { Controller, Get, UseGuards, Patch, Body, Param } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { AuthGuard } from '@/auth/auth.guard';

@Controller('admin/permissions')
@UseGuards(AuthGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('name') name: string) {
    return this.permissionsService.update(+id, name);
  }
}
