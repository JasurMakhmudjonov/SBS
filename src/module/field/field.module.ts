import { Module } from '@nestjs/common';
import { FieldService } from './field.service';
import { FieldController } from './field.controller';
import { PrismaModule } from '@prisma';
import { DistrictModule } from '../district';
import { SportCategoryModule } from '../sport-category';
import { UsersModule } from '../users';

@Module({
  imports: [PrismaModule, DistrictModule, SportCategoryModule, UsersModule],
  controllers: [FieldController],
  providers: [FieldService],
  exports: [FieldService],
})
export class FieldModule {}
