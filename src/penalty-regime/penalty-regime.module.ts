import { Module } from '@nestjs/common';
import { PenaltyRegimeController } from './penalty-regime.controller';
import { PenaltyRegimeService } from './penalty-regime.service';

@Module({
  controllers: [PenaltyRegimeController],
  providers: [PenaltyRegimeService],
  exports: [PenaltyRegimeService],
})
export class PenaltyRegimeModule {}
