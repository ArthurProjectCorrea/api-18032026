import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Profile, Department, Position } from '@prisma/client';

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    user_id?: string;
    user_name?: string;
    action: string;
    table_name?: string;
    record_id?: string;
    description: string;
    old_data?: Prisma.InputJsonValue;
    new_data?: Prisma.InputJsonValue;
  }) {
    return await this.prisma.log.create({
      data,
    });
  }

  async findAll() {
    const logs = (await this.prisma.log.findMany({
      orderBy: { created_at: 'desc' },
      take: 500,
    })) as Array<Record<string, unknown>>;

    const userIds = [
      ...new Set(
        logs.map((l) => l.user_id as string).filter((id): id is string => !!id),
      ),
    ];

    const profiles = (await this.prisma.profile.findMany({
      where: { id: { in: userIds } },
      include: {
        position: {
          include: { department: true },
        },
      },
    })) as (Profile & {
      position: (Position & { department: Department }) | null;
    })[];

    return logs.map((log) => ({
      ...log,
      user: profiles.find((p) => p.id === (log.user_id as string)) || {
        name: (log.user_name as string) || 'Usuário Desconhecido',
        avatar_url: null,
        position: null,
      },
    }));
  }
}
