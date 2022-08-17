import { BadRequestException, Injectable } from '@nestjs/common';

import { CurrencyService } from 'src/modules/currency/currency.service';

import { ExchangeInput } from './dto/ExchangeInput.input';
import { ExchangeResult } from './dto/ExchangeResult.input';

@Injectable()
export class ExchangeService {
  constructor(private currencyService: CurrencyService) {}

  async convertAmount({
    from,
    to,
    amount,
  }: ExchangeInput): Promise<ExchangeResult> {
    if (!from || !to || !amount) throw new BadRequestException();

    try {
      const fromCurrency = await this.currencyService.getCurrency(from);
      const toCurrency = await this.currencyService.getCurrency(to);

      return { amount: (fromCurrency.value / toCurrency.value) * amount };
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
