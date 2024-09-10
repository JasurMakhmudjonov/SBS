import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';
import { PrismaModule } from '@prisma';
import { JwtModule } from '@nestjs/jwt';
import { CountryService } from '../country';

@Module({
  imports: [PrismaModule, JwtModule ],
  controllers: [RegionController],
  providers: [RegionService,CountryService],
  exports: [RegionService],
})
export class RegionModule {}
