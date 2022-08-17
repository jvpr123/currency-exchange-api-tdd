import { Repository } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Currency } from './entities/Currency.entity';
import { CreateCurrencyInput } from './dto/CreateCurrency.input';
import { UpdateCurrencyInput } from './dto/UpdateCurrency.input';
import { validateOrReject } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';

export class CurrencyRepository {
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
  ) {}

  async createCurrency(data: CreateCurrencyInput): Promise<Currency> {
    const currency = new Currency();
    Object.assign(currency, data);

    try {
      await validateOrReject(currency);

      return await this.currencyRepository.save(currency);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findBySign(currency: string): Promise<Currency> {
    const data = await this.currencyRepository.findOneBy({ currency });

    if (!data) throw new NotFoundException();

    return data;
  }

  async updateCurrency(data: UpdateCurrencyInput): Promise<Currency> {
    const currencyToUpdate = await this.currencyRepository.findOneBy({
      currency: data.currency,
    });

    if (!currencyToUpdate) throw new NotFoundException();

    try {
      const updated = Object.assign(currencyToUpdate, data);
      return await this.currencyRepository.save(updated);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteCurrency(currency: string): Promise<void> {
    const currencyToDelete = await this.currencyRepository.findOneBy({
      currency,
    });

    if (!currencyToDelete) throw new NotFoundException();

    try {
      await this.currencyRepository.delete({ currency });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
