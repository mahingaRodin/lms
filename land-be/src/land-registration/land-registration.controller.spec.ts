import { Test, TestingModule } from '@nestjs/testing';
import { LandRegistrationController } from './land-registration.controller';

describe('LandRegistrationController', () => {
  let controller: LandRegistrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LandRegistrationController],
    }).compile();

    controller = module.get<LandRegistrationController>(LandRegistrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
