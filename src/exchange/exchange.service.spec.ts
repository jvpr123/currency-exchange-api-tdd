import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CurrencyService } from 'src/currency/currency.service';

import { ExchangeService } from './exchange.service';
import { IExchangeInput } from './dto/ExchangeInput.interface';

describe('ExchangeService', () => {
  let service: ExchangeService;
  let currencyService: CurrencyService;

  const mockInputData = (): IExchangeInput => ({
    from: 'USD',
    to: 'BRL',
    amount: 1,
  });

  beforeEach(async () => {
    const currencyServiceMock = {
      getCurrency: jest.fn().mockResolvedValue({ value: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
        { provide: CurrencyService, useFactory: () => currencyServiceMock },
      ],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
    currencyService = module.get<CurrencyService>(CurrencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('convertAmount()', () => {
    it('should throw an error when called with invalid parameters', async () => {
      expect(
        service.convertAmount({ from: '', to: '', amount: 2 }),
      ).rejects.toThrowError(new BadRequestException());
    });

    it('should not throw when called with valid parameters', async () => {
      expect(
        service.convertAmount(mockInputData()),
      ).resolves.not.toThrowError();
    });

    it('should call getCurrency() method twice', async () => {
      await service.convertAmount(mockInputData());
      expect(currencyService.getCurrency).toHaveBeenCalledTimes(2);
    });

    it('should call getCurrency(currency) method twice with values provided as parameters', async () => {
      await service.convertAmount(mockInputData());
      expect(currencyService.getCurrency).toHaveBeenCalledWith('USD');
      expect(currencyService.getCurrency).toHaveBeenLastCalledWith('BRL');
    });

    it('should throw an error when getCurrency(currency) throws', async () => {
      (currencyService.getCurrency as jest.Mock).mockRejectedValueOnce(
        new Error(),
      );
      expect(service.convertAmount(mockInputData())).rejects.toThrow();
    });

    it('should return converted amount when valid parameters are provided', async () => {
      (currencyService.getCurrency as jest.Mock).mockResolvedValueOnce({
        value: 1,
      });
      (currencyService.getCurrency as jest.Mock).mockResolvedValueOnce({
        value: 0.2,
      });

      expect(service.convertAmount(mockInputData())).resolves.toEqual({
        amount: 5,
      });
    });
  });
});
