import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  create(createDepartmentDto: CreateDepartmentDto) {
    return this.prisma.department.create({
      data: {
        name: createDepartmentDto.name,
      },
    });
  }

  findAll() {
    return this.prisma.department.findMany({
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.department.findUnique({
      where: { id },
    });
  }

  update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return this.prisma.department.update({
      where: { id },
      data: {
        name: updateDepartmentDto.name,
      },
    });
  }

  remove(id: number) {
    return this.prisma.department.delete({
      where: { id },
    });
  }
}
