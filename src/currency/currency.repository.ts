import { Currency } from './entities/Currency.entity';
import { CreateCurrencyInput } from './dto/CreateCurrency.input';
import { UpdateCurrencyInput } from './dto/UpdateCurrency.input';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

export class CurrencyRepository extends Repository<Currency> {
  async createCurrency({
    currency,
    value,
  }: CreateCurrencyInput): Promise<Currency> {
    return new Currency();
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
