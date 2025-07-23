import { Test, TestingModule } from '@nestjs/testing';
import { ConstructionController } from './construction.controller';

describe('ConstructionController', () => {
  let controller: ConstructionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConstructionController],
    }).compile();

    controller = module.get<ConstructionController>(ConstructionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
