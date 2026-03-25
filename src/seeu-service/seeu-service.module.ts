import { Module } from '@nestjs/common';
import { SeeuServiceController } from './seeu-service.controller';
import { SeeuServiceService } from './seeu-service.service';

@Module({
  controllers: [SeeuServiceController],
  providers: [SeeuServiceService],
  exports: [SeeuServiceService],
})
export class SeeuServiceModule {}
