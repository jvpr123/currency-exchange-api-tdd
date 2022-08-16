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
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findBySign()', () => {
    it('should call findOneBy() with correct values', async () => {
      repository.findOneBy = jest.fn().mockResolvedValueOnce({});
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

  describe('findBySign()', () => {
    beforeEach(() => (repository.save = jest.fn()));
    it('should call create() with correct values', async () => {
      await repository.createCurrency(makeCurrencyMock());
      expect(repository.save).toHaveBeenCalledWith(makeCurrencyMock());
    });

    it('should throw an error when invalid params are provided', async () => {
      repository.save = jest
        .fn()
        .mockRejectedValueOnce(new InternalServerErrorException());

      expect(repository.save(makeCurrencyMock())).rejects.toThrow(
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

      expect(repository.save(makeCurrencyMock())).resolves.toEqual(
        makeCurrencyMock(),
      );
    });
  });
});
