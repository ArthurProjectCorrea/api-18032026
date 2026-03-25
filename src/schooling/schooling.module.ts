import { Module } from '@nestjs/common';
import { SchoolingController } from './schooling.controller';
import { SchoolingService } from './schooling.service';

@Module({
  controllers: [SchoolingController],
  providers: [SchoolingService],
  exports: [SchoolingService],
})
export class SchoolingModule {}
