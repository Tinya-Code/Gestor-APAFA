import { Test, TestingModule } from '@nestjs/testing';
import { AssembliesController } from './assemblies.controller';
import { AssembliesService } from './assemblies.service';

describe('AssembliesController', () => {
  let controller: AssembliesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssembliesController],
      providers: [AssembliesService],
    }).compile();

    controller = module.get<AssembliesController>(AssembliesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
