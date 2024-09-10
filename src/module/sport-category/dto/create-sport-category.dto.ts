import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSportCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  @ApiProperty({ example: 'name' })
  name: string;
}
