import { Test, TestingModule } from '@nestjs/testing';
import { AsambleaExisteRd } from './asamblea-existe.rd';

describe('AsambleaExisteRd', () => {
  let provider: AsambleaExisteRd;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsambleaExisteRd],
    }).compile();

    provider = module.get<AsambleaExisteRd>(AsambleaExisteRd);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
