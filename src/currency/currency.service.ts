import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrencyService {
  async getCurrency(currency: string): Promise<any> {
    return {};
  }
}
