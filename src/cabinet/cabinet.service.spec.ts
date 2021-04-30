import { Test, TestingModule } from '@nestjs/testing';
import { CabinetService } from './cabinet.service';

describe('CabinetService', () => {
  let service: CabinetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CabinetService],
    }).compile();

    service = module.get<CabinetService>(CabinetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
