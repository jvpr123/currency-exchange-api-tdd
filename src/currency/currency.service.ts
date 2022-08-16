import { Injectable, BadRequestException } from '@nestjs/common';

import { Currency } from './entities/Currency.entity';
import { CreateCurrencyInput } from './dto/CreateCurrency.input';
import { UpdateCurrencyInput } from './dto/UpdateCurrency.input';

import { CurrencyRepository } from './currency.repository';

@Injectable()
export class CurrencyService {
  constructor(private repository: CurrencyRepository) {}

  async createCurrency({
    currency,
    value,
  }: CreateCurrencyInput): Promise<Currency> {
    if (value <= 0) throw new BadRequestException();
    return await this.repository.createCurrency({ currency, value });
  }

  async getCurrency(currency: string): Promise<Currency> {
    return await this.repository.findBySign(currency);
  }

  async updateCurrency(data: UpdateCurrencyInput): Promise<Currency> {
    if (data?.value <= 0) throw new BadRequestException();
    return await this.repository.updateCurrency(data);
  }

  async deleteCurrency(currency: string): Promise<void> {
    await this.repository.deleteCurrency(currency);
  }
}
