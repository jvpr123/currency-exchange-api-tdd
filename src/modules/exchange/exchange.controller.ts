import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ExchangeInput } from './dto/ExchangeInput.input';
import { ExchangeResult } from './dto/ExchangeResult.input';
import { ExchangeService } from './exchange.service';

@Controller('exchange')
export class ExchangeController {
  constructor(private service: ExchangeService) {}

  @Get()
  @UsePipes(ValidationPipe)
  async convertAmount(@Query() data: ExchangeInput): Promise<ExchangeResult> {
    return await this.service.convertAmount(data);
  }
}
