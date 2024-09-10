import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'john doe' })
  @IsString()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  fullname: string;

  @ApiProperty({ example: '+998932623040' })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  @MaxLength(254)
  phone_number: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
