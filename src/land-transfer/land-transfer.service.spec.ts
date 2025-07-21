import { Test, TestingModule } from '@nestjs/testing';
import { LandTransferService } from './land-transfer.service';

describe('LandTransferService', () => {
  let service: LandTransferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LandTransferService],
    }).compile();

    service = module.get<LandTransferService>(LandTransferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
