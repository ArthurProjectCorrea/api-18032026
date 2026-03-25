import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.permission.findMany({
      orderBy: { name: 'asc' },
    });
  }

  update(id: number, name: string) {
    return this.prisma.permission.update({
      where: { id },
      data: { name },
    });
  }
}
