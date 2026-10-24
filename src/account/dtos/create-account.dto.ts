import { IsPhoneNumber, IsString, Length } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @Length(3, 50)
  name: string;

  @IsPhoneNumber()
  phoneNumber: string;
}
