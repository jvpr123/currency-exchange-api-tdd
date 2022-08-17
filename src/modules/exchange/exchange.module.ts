import { Module } from '@nestjs/common';

import { CurrencyModule } from 'src/modules/currency/currency.module';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';

@Module({
  imports: [CurrencyModule],
  providers: [ExchangeService],
  controllers: [ExchangeController],
})
export class ExchangeModule {}
