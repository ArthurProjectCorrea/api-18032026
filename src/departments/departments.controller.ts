import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

import { AuthGuard } from '@/auth/auth.guard';
import { PermissionsGuard } from '@/auth/permissions.guard';
import { CheckPermissions } from '@/auth/permissions.decorator';
import { SCREENS, ACTIONS } from '@/common/constants/permissions';

@Controller('departments')
@UseGuards(AuthGuard, PermissionsGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @CheckPermissions(SCREENS.DEPARTMENTS, ACTIONS.CREATE)
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  @CheckPermissions(SCREENS.DEPARTMENTS, ACTIONS.VIEW)
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  @CheckPermissions(SCREENS.DEPARTMENTS, ACTIONS.VIEW)
  findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(+id);
  }

  @Patch(':id')
  @CheckPermissions(SCREENS.DEPARTMENTS, ACTIONS.EDIT)
  update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(+id, updateDepartmentDto);
  }

  @Delete(':id')
  @CheckPermissions(SCREENS.DEPARTMENTS, ACTIONS.DELETE)
  remove(@Param('id') id: string) {
    return this.departmentsService.remove(+id);
  }
}
