import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CurrencyService } from './currency.service';
import { CurrencyRepository } from './currency.repository';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let repository: CurrencyRepository;

  const makeCurrencyMock = (value?: number) => ({
    currency: 'USD',
    value: value ? value : 1,
  });

  beforeEach(async () => {
    const makeCurrencyRepositoryMock = () => ({
      createCurrency: jest.fn().mockResolvedValue(makeCurrencyMock()),
      findBySign: jest.fn().mockResolvedValue(makeCurrencyMock()),
      updateCurrency: jest.fn().mockResolvedValue(makeCurrencyMock()),
      deleteCurrency: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyService,
        {
          provide: CurrencyRepository,
          useFactory: () => makeCurrencyRepositoryMock(),
        },
      ],
    }).compile();

    service = module.get<CurrencyService>(CurrencyService);
    repository = module.get<CurrencyRepository>(CurrencyRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCurrency()', () => {
    it('should throw an error when repository throws', async () => {
      (repository.findBySign as jest.Mock).mockRejectedValueOnce(
        new InternalServerErrorException(),
      );
      expect(service.getCurrency('')).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('should not throw when repository returns', async () => {
      expect(service.getCurrency('BRL')).resolves.not.toThrow();
    });

    it('should call repository with correct parameters', async () => {
      await service.getCurrency('USD');
      expect(repository.findBySign).toHaveBeenCalledWith('USD');
    });

    it('should return correct value fetched by repository', async () => {
      expect(service.getCurrency('USD')).resolves.toEqual(makeCurrencyMock());
    });
  });

  describe('createCurrency()', () => {
    it('should throw an error when repository throws', async () => {
      (repository.createCurrency as jest.Mock).mockRejectedValueOnce(
        new InternalServerErrorException(),
      );
      expect(service.createCurrency(makeCurrencyMock())).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('should not throw when repository returns', async () => {
      expect(service.createCurrency(makeCurrencyMock())).resolves.not.toThrow();
    });

    it('should call repository with correct parameters', async () => {
      await service.createCurrency(makeCurrencyMock());
      expect(repository.createCurrency).toHaveBeenCalledWith(
        makeCurrencyMock(),
      );
    });

    it('should throw an error when value provided is smaller or equal 0', async () => {
      expect(
        service.createCurrency({ currency: 'USD', value: 0 }),
      ).rejects.toThrow(new BadRequestException());
    });
  });

  describe('updateCurrency()', () => {
    it('should throw an error when repository throws', async () => {
      (repository.updateCurrency as jest.Mock).mockRejectedValueOnce(
        new InternalServerErrorException(),
      );
      expect(service.updateCurrency(makeCurrencyMock(5))).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('should not throw when repository returns', async () => {
      expect(
        service.updateCurrency(makeCurrencyMock(5)),
      ).resolves.not.toThrow();
    });

    it('should call repository with correct parameters', async () => {
      await service.updateCurrency(makeCurrencyMock(5));
      expect(repository.updateCurrency).toHaveBeenCalledWith(
        makeCurrencyMock(5),
      );
    });

    it('should throw an error when value provided is smaller or equal 0', async () => {
      expect(
        service.createCurrency({ currency: 'USD', value: 0 }),
      ).rejects.toThrow(new BadRequestException());
    });
  });

  describe('deleteCurrency()', () => {
    it('should throw an error when repository throws', async () => {
      (repository.deleteCurrency as jest.Mock).mockRejectedValueOnce(
        new InternalServerErrorException(),
      );
      expect(service.deleteCurrency('')).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('should not throw when repository returns', async () => {
      expect(service.deleteCurrency('USD')).resolves.not.toThrow();
    });

    it('should call repository with correct parameters', async () => {
      await service.deleteCurrency('USD');
      expect(repository.deleteCurrency).toHaveBeenCalledWith('USD');
    });
  });
});
