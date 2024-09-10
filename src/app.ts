import { databaseConfig, jwtConfig, r2Config } from '@config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@prisma';
import { UploadModule } from './upload/upload.module';
import {
  AuthModule,
  BookingModule,
  CountryModule,
  DistrictModule,
  FieldModule,
  RegionModule,
  ReviewModule,
  SportCategoryModule,
  UsersModule
} from '@module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, r2Config],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CountryModule,
    RegionModule,
    DistrictModule,
    SportCategoryModule,
    FieldModule,
    ReviewModule,
    UploadModule,
    BookingModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
