import { Test, TestingModule } from '@nestjs/testing';
import { AsambleaRepository } from './asamblea.repository';

describe('AsambleaRepository', () => {
  let provider: AsambleaRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsambleaRepository],
    }).compile();

    provider = module.get<AsambleaRepository>(AsambleaRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
