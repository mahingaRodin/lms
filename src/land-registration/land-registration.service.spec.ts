import { Test, TestingModule } from '@nestjs/testing';
import { LandRegistrationService } from './land-registration.service';

describe('LandRegistrationService', () => {
  let service: LandRegistrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LandRegistrationService],
    }).compile();

    service = module.get<LandRegistrationService>(LandRegistrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
