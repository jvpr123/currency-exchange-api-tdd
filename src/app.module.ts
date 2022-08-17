import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Currency } from './modules/currency/entities/Currency.entity';
import { CurrencyModule } from './modules/currency/currency.module';

import { ExchangeModule } from './modules/exchange/exchange.module';

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
  controllers: [],
})
export class AppModule {}
