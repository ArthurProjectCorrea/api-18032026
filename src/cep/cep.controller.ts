import { Controller, Get, Param } from '@nestjs/common';
import { CepService } from './cep.service';

@Controller('admin/cep')
export class CepController {
  constructor(private readonly cepService: CepService) {}

  @Get(':cep')
  async searchCep(@Param('cep') cep: string) {
    return this.cepService.searchCep(cep);
  }
}
