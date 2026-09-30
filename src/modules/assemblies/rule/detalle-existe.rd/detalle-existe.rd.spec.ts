import { Test, TestingModule } from '@nestjs/testing';
import { DetalleExisteRd } from './detalle-existe.rd';

describe('DetalleExisteRd', () => {
  let provider: DetalleExisteRd;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetalleExisteRd],
    }).compile();

    provider = module.get<DetalleExisteRd>(DetalleExisteRd);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
