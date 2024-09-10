import { databaseConfig, jwtConfig, r2Config } from '@config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@prisma';
import { UploadModule } from './upload/upload.module';
import {
  AuthModule,
  CountryModule,
  DistrictModule,
  FieldModule,
  RegionModule,
  SportCategoryModule,
  UsersModule,
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
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
