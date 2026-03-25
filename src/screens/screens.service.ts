import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ScreensService {
  constructor(private prisma: PrismaService) {}

  findAll(includeSubScreens: boolean = false) {
    return this.prisma.screen.findMany({
      where: includeSubScreens ? undefined : { is_sub_screen: false },
      orderBy: { name: 'asc' },
    });
  }

  update(id: number, name: string) {
    return this.prisma.screen.update({
      where: { id },
      data: { name },
    });
  }

  findOneByKey(key: string) {
    return this.prisma.screen.findFirst({
      where: { name_key: key },
    });
  }
}
