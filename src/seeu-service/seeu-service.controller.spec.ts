import { Test, TestingModule } from '@nestjs/testing';
import { SeeuServiceController } from './seeu-service.controller';

describe('SeeuServiceController', () => {
  let controller: SeeuServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeeuServiceController],
    }).compile();

    controller = module.get<SeeuServiceController>(SeeuServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
