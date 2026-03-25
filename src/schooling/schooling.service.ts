import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SchoolingService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.schooling.findMany({
      orderBy: { id: 'asc' },
    });
  }
}
