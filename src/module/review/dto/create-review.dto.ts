import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsInt, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Great stadium, had an amazing time!' })
  @IsNotEmpty()
  @IsString()
  comment: string;

  @ApiProperty({ example: '44fd817e-02fc-4410-b6a4-7021a8270957' })
  @IsNotEmpty()
  @IsUUID()
  fieldId: string;
}
