import { Test, TestingModule } from '@nestjs/testing';
import { DetalleRepository } from './detalle.repository';

describe('DetalleRepository', () => {
  let provider: DetalleRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetalleRepository],
    }).compile();

    provider = module.get<DetalleRepository>(DetalleRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
