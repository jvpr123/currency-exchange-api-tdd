import { IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateCurrencyInput {
  @IsNotEmpty()
  @Length(3, 3)
  currency: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}
