import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Currency } from './entities/Currency.entity';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { CurrencyRepository } from './currency.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Currency, CurrencyRepository])],
  providers: [CurrencyService],
  controllers: [CurrencyController],
  exports: [CurrencyService],
})
export class CurrencyModule {}
