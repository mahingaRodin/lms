import { Test, TestingModule } from '@nestjs/testing';
import { ConflictResolutionService } from './conflict-resolution.service';

describe('ConflictResolutionService', () => {
  let service: ConflictResolutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConflictResolutionService],
    }).compile();

    service = module.get<ConflictResolutionService>(ConflictResolutionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
