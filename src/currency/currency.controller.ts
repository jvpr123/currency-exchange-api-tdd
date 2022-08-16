import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Currency } from './entities/Currency.entity';
import { CurrencyService } from './currency.service';
import { CreateCurrencyInput } from './dto/CreateCurrency.input';
import { UpdateCurrencyInput } from './dto/UpdateCurrency.input';

@Controller('currency')
export class CurrencyController {
  constructor(private service: CurrencyService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCurrency(@Body() data: CreateCurrencyInput): Promise<Currency> {
    return await this.service.createCurrency(data);
  }

  @Get('/:currency')
  async getCurrency(@Param('currency') currency: string): Promise<Currency> {
    return await this.service.getCurrency(currency);
  }

  @Patch('/:currency/:value')
  async updateCurrency(@Param() data: UpdateCurrencyInput): Promise<Currency> {
    return await this.service.updateCurrency(data);
  }

  @Delete('/:currency')
  async deleteCurrency(@Param('currency') currency: string): Promise<void> {
    return await this.service.deleteCurrency(currency);
  }
}
