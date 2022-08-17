import { Module } from '@nestjs/common';

import { CurrencyModule } from 'src/modules/currency/currency.module';
import { ExchangeService } from './exchange.service';

@Module({
  imports: [CurrencyModule],
  providers: [ExchangeService],
})
export class ExchangeModule {}
