import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Injectable()
export class PositionsService {
  constructor(private prisma: PrismaService) {}

  async create(createPositionDto: CreatePositionDto) {
    const { name, department_id, accesses } = createPositionDto;

    return this.prisma.position.create({
      data: {
        name,
        department_id,
        accesses: {
          create: accesses?.map((access) => ({
            screen_id: access.screen_id,
            permission_id: access.permission_id,
            scope: access.scope || 'all',
          })),
        },
      },
      include: {
        accesses: true,
      },
    });
  }

  findAll() {
    return this.prisma.position.findMany({
      include: {
        department: true,
        accesses: {
          include: {
            screen: true,
            permission: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.position.findUnique({
      where: { id },
      include: {
        department: true,
        accesses: {
          include: {
            screen: true,
            permission: true,
          },
        },
      },
    });
  }

  async update(id: number, updatePositionDto: UpdatePositionDto) {
    const { name, department_id, accesses } = updatePositionDto;

    // Delete existing accesses first (simpler sync)
    await this.prisma.access.deleteMany({
      where: { position_id: id },
    });

    return this.prisma.position.update({
      where: { id },
      data: {
        name,
        department_id,
        accesses: {
          create: accesses?.map((access) => ({
            screen_id: access.screen_id,
            permission_id: access.permission_id,
            scope: access.scope || 'all',
          })),
        },
      },
      include: {
        accesses: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.position.delete({
      where: { id },
    });
  }
}
