import { Test, TestingModule } from '@nestjs/testing';

import { Currency } from './entities/Currency.entity';
import { CreateCurrencyInput } from './dto/CreateCurrency.input';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';

describe('CurrencyController', () => {
  let controller: CurrencyController;
  let service: CurrencyService;

  const makeCurrencyService = () => ({
    createCurrency: jest.fn().mockResolvedValue(makeCurrencyMock()),
    getCurrency: jest.fn().mockResolvedValue(makeCurrencyMock()),
    updateCurrency: jest.fn().mockResolvedValue(makeCurrencyMock()),
    deleteCurrency: jest.fn(),
  });
  const makeCurrencyMock = () => new Currency();
  const makeCreateCurrencyDTO = (): CreateCurrencyInput => ({
    currency: 'USD',
    value: 1,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyController],
      providers: [
        {
          provide: CurrencyService,
          useFactory: () => makeCurrencyService(),
        },
      ],
    }).compile();

    controller = module.get<CurrencyController>(CurrencyController);
    service = module.get<CurrencyService>(CurrencyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET - getCurrency()', () => {
    it('should throw an error when currency service throws', async () => {
      service.getCurrency = jest.fn().mockRejectedValueOnce(new Error());
      expect(controller.getCurrency('USD')).rejects.toThrow();
    });

    it('should call service with correct values', async () => {
      controller.getCurrency('USD');
      expect(service.getCurrency).toHaveBeenCalledWith('USD');
    });

    it('should return when service returns a value', async () => {
      expect(controller.getCurrency('USD')).resolves.toEqual(
        makeCurrencyMock(),
      );
    });
  });

  describe('POST - createCurrency()', () => {
    it('should throw an error when currency service throws', async () => {
      service.createCurrency = jest.fn().mockRejectedValueOnce(new Error());
      expect(
        controller.createCurrency(makeCreateCurrencyDTO()),
      ).rejects.toThrow(new Error());
    });

    it('should call service with correct values', async () => {
      controller.createCurrency(makeCreateCurrencyDTO());
      expect(service.createCurrency).toHaveBeenCalledWith(
        makeCreateCurrencyDTO(),
      );
    });

    it('should return when service returns a value', async () => {
      expect(
        controller.createCurrency(makeCreateCurrencyDTO()),
      ).resolves.toEqual(makeCurrencyMock());
    });
  });

  describe('PATCH - updateCurrency()', () => {
    it('should throw an error when currency service throws', async () => {
      service.updateCurrency = jest.fn().mockRejectedValueOnce(new Error());
      expect(
        controller.updateCurrency(makeCreateCurrencyDTO()),
      ).rejects.toThrow(new Error());
    });

    it('should call service with correct values', async () => {
      controller.updateCurrency(makeCreateCurrencyDTO());
      expect(service.updateCurrency).toHaveBeenCalledWith(
        makeCreateCurrencyDTO(),
      );
    });

    it('should return when service returns a value', async () => {
      expect(
        controller.updateCurrency(makeCreateCurrencyDTO()),
      ).resolves.toEqual(makeCurrencyMock());
    });
  });

  describe('DELETE - deleteCurrency()', () => {
    it('should throw an error when currency service throws', async () => {
      service.deleteCurrency = jest.fn().mockRejectedValueOnce(new Error());
      expect(controller.deleteCurrency('USD')).rejects.toThrow(new Error());
    });

    it('should call service with correct values', async () => {
      controller.deleteCurrency('USD');
      expect(service.deleteCurrency).toHaveBeenCalledWith('USD');
    });
  });
});
