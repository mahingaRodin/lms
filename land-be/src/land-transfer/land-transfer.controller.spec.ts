import { Test, TestingModule } from '@nestjs/testing';
import { LandTransferController } from './land-transfer.controller';

describe('LandTransferController', () => {
  let controller: LandTransferController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LandTransferController],
    }).compile();

    controller = module.get<LandTransferController>(LandTransferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
