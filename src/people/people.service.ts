import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

export class CreatePersonDto {
  name!: string;
  mothers_name!: string;
  fathers_name?: string;
  date_of_birth!: string;
  cpf!: string;
  schooling_id!: number;
  telephones?: string[];
  addresses?: {
    cep_id?: number;
    not_cep?: string;
    number?: string;
    complement?: string;
  }[];
  lawsuit?: {
    number: string;
    regime_progression: string;
    penalty_regime_id: number;
  };
}

@Injectable()
export class PeopleService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePersonDto) {
    const existingPerson = await this.prisma.person.findUnique({
      where: { cpf: data.cpf },
    });
    if (existingPerson) {
      throw new ConflictException(
        'Pessoa com este CPF já está cadastrada. Realize a busca primeiro.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Criar Pessoa
      const person = await tx.person.create({
        data: {
          name: data.name,
          mothers_name: data.mothers_name,
          fathers_name: data.fathers_name,
          date_of_birth: new Date(data.date_of_birth),
          cpf: data.cpf,
          schooling_id: data.schooling_id,
        },
      });

      // 2. Criar Telefones
      if (data.telephones?.length) {
        await tx.telephone.createMany({
          data: data.telephones.map((t) => ({
            telephone: t,
            person_id: person.id,
          })),
        });
      }

      // 3. Criar Endereços
      if (data.addresses?.length) {
        await tx.address.createMany({
          data: data.addresses.map((a) => ({
            ...a,
            person_id: person.id,
          })),
        });
      }

      // 4. Criar Processo (se fornecido)
      let lawsuit: unknown = null;
      if (data.lawsuit) {
        lawsuit = await tx.lawsuit.create({
          data: {
            ...data.lawsuit,
            regime_progression: new Date(data.lawsuit.regime_progression),
            person_id: person.id,
          },
        });
      }

      return { ...person, lawsuit };
    });
  }

  async findAll() {
    return await this.prisma.person.findMany({
      include: {
        schooling: true,
        lawsuits: {
          include: { penalty_regime: true },
        },
        telephones: true,
        addresses: { include: { cep: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    return await this.prisma.person.findUnique({
      where: { id },
      include: {
        schooling: true,
        lawsuits: {
          include: { penalty_regime: true },
        },
        telephones: true,
        addresses: { include: { cep: true } },
      },
    });
  }

  async findByCpf(cpf: string) {
    return await this.prisma.person.findUnique({
      where: { cpf },
      include: {
        schooling: true,
        lawsuits: {
          include: { penalty_regime: true },
        },
        telephones: true,
        addresses: { include: { cep: true } },
      },
    });
  }

  async addLawsuit(
    personId: string,
    data: {
      number: string;
      penalty_regime_id: number;
      regime_progression: string;
    },
  ) {
    return this.prisma.lawsuit.create({
      data: {
        number: data.number,
        penalty_regime_id: data.penalty_regime_id,
        regime_progression: new Date(data.regime_progression),
        person_id: personId,
      },
      include: { penalty_regime: true },
    });
  }

  async addTelephone(personId: string, data: { telephone: string }) {
    return this.prisma.telephone.create({
      data: { ...data, person_id: personId },
    });
  }

  async addAddress(
    personId: string,
    data: {
      cep_id?: number;
      not_cep?: string;
      number?: string;
      complement?: string;
    },
  ) {
    return this.prisma.address.create({
      data: { ...data, person_id: personId },
      include: { cep: true },
    });
  }
}
