import { Test, TestingModule } from '@nestjs/testing';
import { FitnessTestResultController } from './fitness-test-result.controller';
import { FitnessTestResultService } from './fitness-test-result.service';

describe('FitnessTestResultController', () => {
  let controller: FitnessTestResultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FitnessTestResultController],
      providers: [FitnessTestResultService],
    }).compile();

    controller = module.get<FitnessTestResultController>(
      FitnessTestResultController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
