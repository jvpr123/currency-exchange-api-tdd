import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Currency } from './currency/entities/Currency.entity';
import { ExchangeModule } from './exchange/exchange.module';
import { CurrencyModule } from './currency/currency.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://1.0.0.3/exchange',
      entities: [Currency],
      autoLoadEntities: true,
      synchronize: true,
      useUnifiedTopology: true,
    }),
    ExchangeModule,
    CurrencyModule,
  ],
})
export class AppModule {}
