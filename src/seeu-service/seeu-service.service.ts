import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

export class CreateSeeuServiceDto {
  lawsuit_id!: string;
  proof_of_residence!: string;
  proof_of_employment!: string;
  proof_of_legal_waiver!: string;
  created_by!: string;
  telephone_id?: number;
  address_id?: number;
}

@Injectable()
export class SeeuServiceService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSeeuServiceDto) {
    const lawsuit = await this.prisma.lawsuit.findUnique({
      where: { id: data.lawsuit_id },
      select: { person_id: true },
    });

    if (!lawsuit) {
      throw new Error('Processo não encontrado');
    }

    const previousSignaturesCount = await this.prisma.seeuService.count({
      where: {
        lawsuit: { person_id: lawsuit.person_id },
        deleted_at: null,
      },
    });

    const is_first_signature = previousSignaturesCount === 0;

    return await this.prisma.seeuService.create({
      data: {
        ...data,
        is_first_signature,
        updated_by: data.created_by,
      },
    });
  }

  async findAll() {
    const services = await this.prisma.seeuService.findMany({
      where: { deleted_at: null },
      include: {
        lawsuit: {
          include: {
            person: {
              include: {
                schooling: true,
                telephones: true,
                addresses: true,
                lawsuits: { include: { penalty_regime: true } },
              },
            },
            penalty_regime: true,
          },
        },
        telephone: true,
        address: true,
      },
      orderBy: { created_at: 'desc' },
    });

    const userIds = [...new Set(services.map((s) => s.created_by))];
    const profiles = await this.prisma.profile.findMany({
      where: { id: { in: userIds } },
      include: { position: { include: { department: true } } },
    });

    return services.map((s) => ({
      ...s,
      creator_profile: profiles.find((p) => p.id === s.created_by) || null,
    }));
  }

  async findOne(id: string) {
    const service = await this.prisma.seeuService.findUnique({
      where: { id },
      include: {
        lawsuit: {
          include: {
            person: {
              include: {
                schooling: true,
                telephones: true,
                addresses: true,
                lawsuits: { include: { penalty_regime: true } },
              },
            },
            penalty_regime: true,
          },
        },
        telephone: true,
        address: true,
      },
    });

    if (!service) return null;

    let profile: unknown = null;
    if (service.created_by) {
      profile = await this.prisma.profile.findUnique({
        where: { id: service.created_by },
        include: { position: { include: { department: true } } },
      });
    }

    return {
      ...service,
      creator_profile: profile,
    };
  }

  async checkMonthlySignature(
    cpf: string,
    lawsuit_number: string,
  ): Promise<boolean> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const count = await this.prisma.seeuService.count({
      where: {
        lawsuit: {
          number: lawsuit_number,
          person: { cpf },
        },
        created_at: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        deleted_at: null,
      },
    });

    return count > 0;
  }

  async softDelete(id: string, deleted_by: string) {
    return await this.prisma.seeuService.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by,
      },
    });
  }
}
