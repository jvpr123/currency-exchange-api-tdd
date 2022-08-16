import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

import { CurrencyRepository } from './currency.repository';
import { Currency } from './entities/Currency.entity';

describe('Currency Repository', () => {
  let repository: CurrencyRepository;

  const makeCurrencyMock = (value?: number) => ({
    currency: 'USD',
    value: value ? value : 1,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrencyRepository],
    }).compile();

    repository = module.get<CurrencyRepository>(CurrencyRepository);

    repository.save = jest.fn();
    repository.findOneBy = jest.fn().mockReturnValue(makeCurrencyMock());
    repository.delete = jest.fn();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findBySign()', () => {
    it('should call findOneBy() with correct values', async () => {
      await repository.findBySign('USD');
      expect(repository.findOneBy).toHaveBeenCalledWith({ currency: 'USD' });
    });

    it('should throw an error if findOneBy() returns undefined', async () => {
      repository.findOneBy = jest.fn().mockResolvedValueOnce(undefined);
      expect(repository.findBySign('USD')).rejects.toThrow(
        new NotFoundException(),
      );
    });

    it('should return a Currency instance when findOneBy() returns', async () => {
      repository.findOneBy = jest
        .fn()
        .mockResolvedValueOnce(makeCurrencyMock() as Currency);

      expect(repository.findBySign('USD')).resolves.toEqual(makeCurrencyMock());
    });
  });

  describe('createCurrency()', () => {
    it('should call create() with correct values', async () => {
      await repository.createCurrency(makeCurrencyMock());
      expect(repository.save).toHaveBeenCalledWith(makeCurrencyMock());
    });

    it('should throw an error when invalid params are provided', async () => {
      repository.save = jest
        .fn()
        .mockRejectedValueOnce(new InternalServerErrorException());

      expect(repository.createCurrency(makeCurrencyMock())).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('should throw an error when save() throws', async () => {
      repository.save = jest
        .fn()
        .mockRejectedValueOnce(new InternalServerErrorException());

      expect(repository.save(makeCurrencyMock())).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('should return a Currency instance when save() returns created data', async () => {
      repository.save = jest
        .fn()
        .mockResolvedValueOnce(makeCurrencyMock() as Currency);

      expect(repository.createCurrency(makeCurrencyMock())).resolves.toEqual(
        makeCurrencyMock(),
      );
    });
  });

  describe('updateCurrency()', () => {
    it('should call findOneBy() with correct values', async () => {
      const data = makeCurrencyMock();

      await repository.updateCurrency(data);
      expect(repository.findOneBy).toHaveBeenCalledWith({
        currency: data.currency,
      });
    });

    it('should throw an error when findOneBy() returns undefined', async () => {
      repository.findOneBy = jest.fn().mockReturnValueOnce(undefined);
      expect(repository.updateCurrency(makeCurrencyMock())).rejects.toThrow(
        new NotFoundException(),
      );
    });

    it('should call save() with correct values', async () => {
      repository.save = jest.fn().mockReturnValueOnce(makeCurrencyMock());

      await repository.updateCurrency(makeCurrencyMock(5));
      expect(repository.save).toHaveBeenCalledWith(makeCurrencyMock(5));
    });

    it('should throw an error when save() throws', async () => {
      repository.save = jest
        .fn()
        .mockRejectedValueOnce(new InternalServerErrorException());

      expect(repository.updateCurrency(makeCurrencyMock())).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('should return an updated Currency instance when save() returns updated data', async () => {
      repository.save = jest
        .fn()
        .mockResolvedValueOnce(makeCurrencyMock(5) as Currency);

      expect(repository.updateCurrency(makeCurrencyMock(5))).resolves.toEqual(
        makeCurrencyMock(5),
      );
    });
  });

  describe('deleteCurrency()', () => {
    const { currency } = makeCurrencyMock();
    it('should call findOneBy() with correct values', async () => {
      await repository.deleteCurrency(currency);
      expect(repository.findOneBy).toHaveBeenCalledWith({ currency });
    });

    it('should throw an error when findOneBy() returns undefined', async () => {
      repository.findOneBy = jest.fn().mockReturnValueOnce(undefined);
      expect(repository.deleteCurrency(currency)).rejects.toThrow(
        new NotFoundException(),
      );
    });

    it('should call delete() with correct values', async () => {
      await repository.deleteCurrency(currency);
      expect(repository.delete).toHaveBeenCalledWith({ currency });
    });

    it('should throw an error when delete() throws', async () => {
      repository.delete = jest
        .fn()
        .mockRejectedValueOnce(new InternalServerErrorException());

      expect(repository.deleteCurrency(currency)).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });
  });
});
