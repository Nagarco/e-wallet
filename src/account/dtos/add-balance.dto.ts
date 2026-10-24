import { IsNumber, IsPhoneNumber, IsPositive } from 'class-validator';

export class AddBalanceDto {
  @IsPhoneNumber()
  phoneNumber: string;

  @IsNumber(
    { allowNaN: false, maxDecimalPlaces: 2 },
    { message: 'Amount must have at most 2 decimal places' },
  )
  @IsPositive({ message: 'Amount must be greater than zero' })
  amount: number;
}
