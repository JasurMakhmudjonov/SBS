import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsInt,
  IsArray,
  IsDate,
  IsEnum,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { PITCHTYPE, VENUETYPE } from '@prisma/client';
import { Type, Transform } from 'class-transformer';
import { LocationDto } from './location-field.dto';

export class CreateFieldDto {
  @ApiProperty({ example: 'Field Name' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim()) // Trim extra spaces
  name: string;

  @ApiProperty({ example: 'Field Description' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  description: string;

  @ApiProperty({ example: ['image1.jpg', 'image2.jpg'] })
  @IsArray()
  @IsNotEmpty()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  image: string[];

  @ApiProperty({ example: '2024-09-08T09:00:00.000Z' })
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  opening_time: Date;

  @ApiProperty({ example: '2024-09-08T18:00:00.000Z' })
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  closing_time: Date;

  @ApiProperty({ example: PITCHTYPE.NATURAL_GRASS })
  @IsEnum(PITCHTYPE)
  @IsNotEmpty()
  pitch_type: PITCHTYPE;

  @ApiProperty({ example: VENUETYPE.OUTDOOR })
  @IsEnum(VENUETYPE)
  @IsNotEmpty()
  venue_type: VENUETYPE;

  @ApiProperty({ example: { latitude: 40.7128, longitude: -74.006 } })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty({ example: 'Category UUID' })
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @ApiProperty({ example: 'District UUID' })
  @IsNotEmpty()
  @IsUUID()
  districtId: string;
}
