import { Test, TestingModule } from '@nestjs/testing';

import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';

import { ExchangeInput } from './dto/ExchangeInput.input';
import { ExchangeResult } from './dto/ExchangeResult.input';

describe('ExchangeController', () => {
  let controller: ExchangeController;
  let service: ExchangeService;

  const mockInputData = (): ExchangeInput => ({
    from: 'USD',
    to: 'BRL',
    amount: 1,
  });

  const mockExchangeResult = (): ExchangeResult => ({ amount: 1 });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeController],
      providers: [
        {
          provide: ExchangeService,
          useFactory: () => ({
            convertAmount: jest.fn().mockResolvedValue(mockExchangeResult()),
          }),
        },
      ],
    }).compile();

    controller = module.get<ExchangeController>(ExchangeController);
    service = module.get<ExchangeService>(ExchangeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET - getCurrency()', () => {
    it('should throw an error when exchange service throws', async () => {
      service.convertAmount = jest.fn().mockRejectedValueOnce(new Error());
      expect(controller.convertAmount(mockInputData())).rejects.toThrow();
    });

    it('should call service with correct values', async () => {
      controller.convertAmount(mockInputData());
      expect(service.convertAmount).toHaveBeenCalledWith(mockInputData());
    });

    it('should return when service returns a value', async () => {
      expect(controller.convertAmount(mockInputData())).resolves.toEqual(
        mockExchangeResult(),
      );
    });
  });
});
