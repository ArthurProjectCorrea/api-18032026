import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PeopleService, CreatePersonDto } from './people.service';
import { AuthGuard } from '@/auth/auth.guard';

@Controller('admin/people')
@UseGuards(AuthGuard)
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.peopleService.create(createPersonDto);
  }

  @Get()
  findAll() {
    return this.peopleService.findAll();
  }

  @Get('by-cpf/:cpf')
  findByCpf(@Param('cpf') cpf: string) {
    return this.peopleService.findByCpf(cpf);
  }

  @Post(':id/lawsuits')
  addLawsuit(
    @Param('id') id: string,
    @Body()
    data: {
      number: string;
      penalty_regime_id: number;
      regime_progression: string;
    },
  ) {
    return this.peopleService.addLawsuit(id, data);
  }

  @Post(':id/telephones')
  addTelephone(@Param('id') id: string, @Body() data: { telephone: string }) {
    return this.peopleService.addTelephone(id, data);
  }

  @Post(':id/addresses')
  addAddress(
    @Param('id') id: string,
    @Body()
    data: {
      cep_id?: number;
      not_cep?: string;
      number?: string;
      complement?: string;
    },
  ) {
    return this.peopleService.addAddress(id, data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.peopleService.findOne(id);
  }
}
