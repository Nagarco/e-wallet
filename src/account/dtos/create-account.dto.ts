import { IsPhoneNumber, IsString, Length } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @Length(3)
  name: string;

  @IsPhoneNumber()
  phoneNumber: string;
}
