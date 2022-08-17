import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

import { CurrencyRepository } from './currency.repository';
import { Currency } from './entities/Currency.entity';
import { Repository } from 'typeorm';

describe('Currency Repository', () => {
  let repository: CurrencyRepository;
  let typeOrmRepository;

  const makeCurrencyMock = (value?: number) => ({
    currency: 'USD',
    value: value ? value : 1,
  });

  const makeCurrencyTypeOrmRepository = () => ({
    save: jest.fn(),
    findOneBy: jest.fn().mockReturnValue(makeCurrencyMock()),
    delete: jest.fn(),
  });

  beforeEach(async () => {
    typeOrmRepository = makeCurrencyTypeOrmRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: typeOrmRepository,
          useValue: typeOrmRepository,
        },
        {
          provide: CurrencyRepository,
          useFactory: (repository: Repository<Currency>) =>
            new CurrencyRepository(repository),
          inject: [typeOrmRepository],
        },
      ],
    }).compile();

    repository = module.get<CurrencyRepository>(CurrencyRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findBySign()', () => {
    it('should call findOneBy() with correct values', async () => {
      await repository.findBySign('USD');
      expect(typeOrmRepository.findOneBy).toHaveBeenCalledWith({
        currency: 'USD',
      });
    });

    it('should throw an error if findOneBy() returns undefined', async () => {
      typeOrmRepository.findOneBy = jest.fn().mockResolvedValueOnce(undefined);
      expect(repository.findBySign('USD')).rejects.toThrow(
        new NotFoundException(),
      );
    });

    it('should return a Currency instance when findOneBy() returns', async () => {
      typeOrmRepository.findOneBy = jest
        .fn()
        .mockResolvedValueOnce(makeCurrencyMock() as Currency);

      expect(repository.findBySign('USD')).resolves.toEqual(makeCurrencyMock());
    });
  });

  describe('createCurrency()', () => {
    it('should call create() with correct values', async () => {
      await repository.createCurrency(makeCurrencyMock());
      expect(typeOrmRepository.save).toHaveBeenCalledWith(makeCurrencyMock());
    });

    it('should throw an error when invalid params are provided', async () => {
      typeOrmRepository.save = jest
        .fn()
        .mockRejectedValueOnce(new InternalServerErrorException());

      expect(repository.createCurrency(makeCurrencyMock())).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('should throw an error when save() throws', async () => {
      typeOrmRepository.save = jest
        .fn()
        .mockRejectedValueOnce(new InternalServerErrorException());

      expect(typeOrmRepository.save(makeCurrencyMock())).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('should return a Currency instance when save() returns created data', async () => {
      typeOrmRepository.save = jest
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
      expect(typeOrmRepository.findOneBy).toHaveBeenCalledWith({
        currency: data.currency,
      });
    });

    it('should throw an error when findOneBy() returns undefined', async () => {
      typeOrmRepository.findOneBy = jest.fn().mockReturnValueOnce(undefined);
      expect(repository.updateCurrency(makeCurrencyMock())).rejects.toThrow(
        new NotFoundException(),
      );
    });

    it('should call save() with correct values', async () => {
      typeOrmRepository.save = jest
        .fn()
        .mockReturnValueOnce(makeCurrencyMock());

      await repository.updateCurrency(makeCurrencyMock(5));
      expect(typeOrmRepository.save).toHaveBeenCalledWith(makeCurrencyMock(5));
    });

    it('should throw an error when save() throws', async () => {
      typeOrmRepository.save = jest
        .fn()
        .mockRejectedValueOnce(new InternalServerErrorException());

      expect(repository.updateCurrency(makeCurrencyMock())).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('should return an updated Currency instance when save() returns updated data', async () => {
      typeOrmRepository.save = jest
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
      expect(typeOrmRepository.findOneBy).toHaveBeenCalledWith({ currency });
    });

    it('should throw an error when findOneBy() returns undefined', async () => {
      typeOrmRepository.findOneBy = jest.fn().mockReturnValueOnce(undefined);
      expect(repository.deleteCurrency(currency)).rejects.toThrow(
        new NotFoundException(),
      );
    });

    it('should call delete() with correct values', async () => {
      await repository.deleteCurrency(currency);
      expect(typeOrmRepository.delete).toHaveBeenCalledWith({ currency });
    });

    it('should throw an error when delete() throws', async () => {
      typeOrmRepository.delete = jest
        .fn()
        .mockRejectedValueOnce(new InternalServerErrorException());

      expect(repository.deleteCurrency(currency)).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });
  });
});
