import { Module } from '@nestjs/common';
import { SportCategoryService } from './sport-category.service';
import { SportCategoryController } from './sport-category.controller';
import { PrismaModule } from '@prisma';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [SportCategoryController],
  providers: [SportCategoryService],
  exports: [SportCategoryService],
})
export class SportCategoryModule {}
