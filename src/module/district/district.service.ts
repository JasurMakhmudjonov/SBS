import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { PrismaService } from '@prisma';
import { RegionService } from '../region';

@Injectable()
export class DistrictService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly regionService: RegionService,
  ) {}

  async create({ name, regionId }: CreateDistrictDto) {
    await this.regionService.findOne(regionId);

    const district = await this.prisma.district.create({
      data: { name, regionId },
    });

    return { message: 'District created successfully', data: district };
  }

  async findAll() {
    const districts = await this.prisma.district.findMany({
      where: { deletedAt: null },
    });

    return { message: 'All districts', data: districts };
  }

  async findOne(id: string) {
    const district = await this.prisma.district.findUnique({
      where: { id },
    });
    if (!district) {
      throw new NotFoundException(`District with ID ${id} not found`);
    }
    return { message: 'District found', data: district };
  }

  async update(id: string, { name, regionId }: UpdateDistrictDto) {
    await this.findOne(id);
    await this.regionService.findOne(regionId);

    const updatedDistrict = await this.prisma.district.update({
      where: { id },
      data: {
        name,
        regionId,
      },
    });

    return { message: 'District updated successfully', data: updatedDistrict };
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedDistrict = await this.prisma.district.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return {
      message: 'District soft deleted successfully',
    };
  }
}
