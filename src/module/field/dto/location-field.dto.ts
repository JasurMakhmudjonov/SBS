import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class LocationDto {
  @ApiProperty({ example: 40.7128 })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: -74.0060 })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;
}
