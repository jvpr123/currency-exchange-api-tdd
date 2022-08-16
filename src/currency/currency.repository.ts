import { Repository } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Currency } from './entities/Currency.entity';
import { CreateCurrencyInput } from './dto/CreateCurrency.input';
import { UpdateCurrencyInput } from './dto/UpdateCurrency.input';
import { validateOrReject } from 'class-validator';

export class CurrencyRepository extends Repository<Currency> {
  async createCurrency(data: CreateCurrencyInput): Promise<Currency> {
    const currency = new Currency();
    Object.assign(currency, data);

    try {
      await validateOrReject(currency);

      return await this.save(currency);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findBySign(currency: string): Promise<Currency> {
    const data = await this.findOneBy({ currency });

    if (!data) throw new NotFoundException();

    return data;
  }

  async updateCurrency(data: UpdateCurrencyInput): Promise<Currency> {
    return;
  }

  async deleteCurrency(currency: string): Promise<void> {
    return;
  }
}
