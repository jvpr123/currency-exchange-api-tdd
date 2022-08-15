import { Currency } from './entities/Currency.entity';
import { UpdateCurrencyInput } from './dto/UpdateCurrency.input';

export class CurrencyRepository {
  async create({ currency, value }: Currency): Promise<Currency> {
    return new Currency();
  }

  async findBySign(currency: string): Promise<Currency> {
    return new Currency();
  }

  async update(data: UpdateCurrencyInput): Promise<Currency> {
    return;
  }

  async delete(currency: string): Promise<void> {
    return;
  }
}
