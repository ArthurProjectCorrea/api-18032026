import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PenaltyRegimeService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.penaltyRegime.findMany({
      orderBy: { id: 'asc' },
    });
  }
}
