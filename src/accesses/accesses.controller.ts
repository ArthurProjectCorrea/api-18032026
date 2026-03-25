import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccessesService } from './accesses.service';

@Controller('accesses')
export class AccessesController {
  constructor(private readonly accessesService: AccessesService) {}

  @Post()
  create() {
    return this.accessesService.create();
  }

  @Get()
  findAll() {
    return this.accessesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accessesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.accessesService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accessesService.remove(+id);
  }
}
