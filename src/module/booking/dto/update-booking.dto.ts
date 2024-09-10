import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsDateString, IsEnum } from 'class-validator';
import { BOOKINGSTATUS } from '@prisma/client';

export class UpdateBookingDto {
  @ApiProperty({ example: '2024-09-08T09:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  booking_date: string;

  @ApiProperty({ example: '2024-09-08T09:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  start_time: string;

  @ApiProperty({ example: '2024-09-08T11:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  end_time: string;

  @ApiProperty({ example: '44fd817e-02fc-4410-b6a4-7021a8270957' })
  @IsNotEmpty()
  @IsUUID()
  fieldId: string;

  @ApiProperty({ example: BOOKINGSTATUS.PENDING, enum: BOOKINGSTATUS })
  @IsEnum(BOOKINGSTATUS)
  status: BOOKINGSTATUS;
}
