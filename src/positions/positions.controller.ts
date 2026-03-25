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
import { PositionsService } from './positions.service';
import { AuthGuard } from '@/auth/auth.guard';
import { PermissionsGuard } from '@/auth/permissions.guard';
import { CheckPermissions } from '@/auth/permissions.decorator';
import { SCREENS, ACTIONS } from '@/common/constants/permissions';

import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Controller('positions')
@UseGuards(AuthGuard, PermissionsGuard)
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  @CheckPermissions(SCREENS.POSITIONS, ACTIONS.CREATE)
  create(@Body() createPositionDto: CreatePositionDto) {
    return this.positionsService.create(createPositionDto);
  }

  @Get()
  @CheckPermissions(SCREENS.POSITIONS, ACTIONS.VIEW)
  findAll() {
    return this.positionsService.findAll();
  }

  @Get(':id')
  @CheckPermissions(SCREENS.POSITIONS, ACTIONS.VIEW)
  findOne(@Param('id') id: string) {
    return this.positionsService.findOne(+id);
  }

  @Patch(':id')
  @CheckPermissions(SCREENS.POSITIONS, ACTIONS.EDIT)
  update(
    @Param('id') id: string,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    return this.positionsService.update(+id, updatePositionDto);
  }

  @Delete(':id')
  @CheckPermissions(SCREENS.POSITIONS, ACTIONS.DELETE)
  remove(@Param('id') id: string) {
    return this.positionsService.remove(+id);
  }
}
