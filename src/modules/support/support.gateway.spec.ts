import { Test, TestingModule } from '@nestjs/testing';
import { SupportGateway } from './support.gateway';
import { SupportService } from './support.service';

describe('SupportGateway', () => {
  let gateway: SupportGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupportGateway, SupportService],
    }).compile();

    gateway = module.get<SupportGateway>(SupportGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
