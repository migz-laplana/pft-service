import { Test, TestingModule } from '@nestjs/testing';
import { FitnessTestResultService } from './fitness-test-result.service';

describe('FitnessTestResultService', () => {
  let service: FitnessTestResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FitnessTestResultService],
    }).compile();

    service = module.get<FitnessTestResultService>(FitnessTestResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
