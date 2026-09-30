import { Test, TestingModule } from '@nestjs/testing';
import { TotalPagesService } from './total-pages.service';

describe('TotalPagesService', () => {
  let service: TotalPagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TotalPagesService],
    }).compile();

    service = module.get<TotalPagesService>(TotalPagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
