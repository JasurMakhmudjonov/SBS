import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';
import { PrismaModule } from '@prisma';
import { RegionService } from '../region'; 
import { JwtModule } from '@nestjs/jwt';
import { CountryService } from '../country';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [DistrictController],
  providers: [DistrictService, RegionService, CountryService], 
  exports: [DistrictService],

})
export class DistrictModule {}
