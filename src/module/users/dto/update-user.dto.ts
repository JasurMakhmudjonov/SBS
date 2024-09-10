import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto extends CreateUserDto {}
export class UpdateProfileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(254)
  fullname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone_number: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
