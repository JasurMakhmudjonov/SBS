import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { RegisterDto } from '../../auth/dto';
import { ROLES } from '@prisma/client';

export class CreateUserDto extends RegisterDto {
  @IsBoolean()
  @IsOptional()
  @IsEnum(ROLES)
  roles: ROLES
}
