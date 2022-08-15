import { BadRequestException, Injectable } from '@nestjs/common';

import { CurrencyService } from 'src/currency/currency.service';

import { IExchangeInput } from './dto/ExchangeInput.interface';
import { IExchangeResult } from './dto/ExchangeResult.interface';

@Injectable()
export class ExchangeService {
  constructor(private currencyService: CurrencyService) {}

  async convertAmount({
    from,
    to,
    amount,
  }: IExchangeInput): Promise<IExchangeResult> {
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
