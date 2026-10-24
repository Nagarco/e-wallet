import { IsNumber, IsPhoneNumber, IsPositive } from 'class-validator';

export class CreateTransferDto {
  @IsPhoneNumber()
  senderPhone: string;

  @IsPhoneNumber()
  receiverPhone: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;
}
