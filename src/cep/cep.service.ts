import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CepService {
  constructor(private prisma: PrismaService) {}

  async searchCep(rawCep: string) {
    const cleanCep = rawCep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos');
    }

    const cachedCep = await this.prisma.cep.findUnique({
      where: { cep: cleanCep },
    });

    if (cachedCep) return cachedCep;

    try {
      const response = await fetch(
        `https://brasilapi.com.br/api/cep/v1/${cleanCep}`,
      );
      if (!response.ok) {
        throw new NotFoundException('CEP não encontrado');
      }

      const external = (await response.json()) as {
        street: string;
        neighborhood: string;
        city: string;
        state: string;
      };

      const newCep = await this.prisma.cep.create({
        data: {
          cep: cleanCep,
          street: external.street || '',
          neighborhood: external.neighborhood || '',
          city: external.city || '',
          state: external.state || '',
        },
      });

      return newCep;
    } catch {
      throw new NotFoundException('CEP não encontrado ou erro na API externa');
    }
  }
}
