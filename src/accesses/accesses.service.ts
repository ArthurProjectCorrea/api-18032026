import { Injectable } from '@nestjs/common';

@Injectable()
export class AccessesService {
  create() {
    return 'This action adds a new access';
  }

  findAll() {
    return `This action returns all accesses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} access`;
  }

  update(id: number) {
    return `This action updates a #${id} access`;
  }

  remove(id: number) {
    return `This action removes a #${id} access`;
  }
}
