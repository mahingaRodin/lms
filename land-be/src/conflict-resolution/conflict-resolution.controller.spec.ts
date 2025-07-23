import { Test, TestingModule } from '@nestjs/testing';
import { ConflictResolutionController } from './conflict-resolution.controller';

describe('ConflictResolutionController', () => {
  let controller: ConflictResolutionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConflictResolutionController],
    }).compile();

    controller = module.get<ConflictResolutionController>(ConflictResolutionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
