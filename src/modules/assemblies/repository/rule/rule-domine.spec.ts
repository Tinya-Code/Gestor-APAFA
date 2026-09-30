import { Test, TestingModule } from '@nestjs/testing';
import { RuleDomain } from './rule-RuleDomain';

describe('RuleDomain', () => {
  let provider: RuleDomain;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RuleDomain],
    }).compile();

    provider = module.get<RuleDomain>(RuleDomain);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
