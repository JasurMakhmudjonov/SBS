import { IsNotEmpty, IsPhoneNumber, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  @MaxLength(254)
  phone_number: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(254)
  password: string;
}
