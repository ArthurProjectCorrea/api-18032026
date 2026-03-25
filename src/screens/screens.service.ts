import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ScreensService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.screen.findMany({
      orderBy: { name: 'asc' },
    });
  }

  findOneByKey(key: string) {
    return this.prisma.screen.findFirst({
      where: { name_key: key },
    });
  }
}
