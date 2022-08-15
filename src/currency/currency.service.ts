import { Injectable, BadRequestException } from '@nestjs/common';

import { Currency } from './entities/Currency.entity';
import { CurrencyRepository } from './currency.repository';
import { UpdateCurrencyInput } from './dto/UpdateCurrency.input';

@Injectable()
export class CurrencyService {
  constructor(private repository: CurrencyRepository) {}

  async createCurrency({ currency, value }: Currency): Promise<Currency> {
    if (value <= 0) throw new BadRequestException();
    return await this.repository.create({ currency, value });
  }

  async getCurrency(currency: string): Promise<Currency> {
    return await this.repository.findBySign(currency);
  }

  async updateCurrency(data: UpdateCurrencyInput): Promise<Currency> {
    if (data?.value <= 0) throw new BadRequestException();
    return await this.repository.update(data);
  }

  async deleteCurrency(currency: string): Promise<void> {
    await this.repository.delete(currency);
  }
}
