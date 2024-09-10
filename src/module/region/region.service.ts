import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from '@prisma';
import { CountryService } from '../country';

@Injectable()
export class RegionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly countryService: CountryService,
  ) {}

  async create({ name, countryId }: CreateRegionDto) {
    const existsRegion = await this.prisma.region.findUnique({
      where: { name },
    });

    if (existsRegion) {
      throw new NotFoundException(`Region with name "${name}" already exists`);
    }

    await this.countryService.findOne(countryId);

    const region = await this.prisma.region.create({
      data: { name, countryId },
    });

    return { message: 'Region created successfully', data: region };
  }

  async findAll() {
    const regions = await this.prisma.region.findMany({
      where: { deletedAt: null },
    });
    return { message: 'All regions', data: regions };
  }

  async findOne(id: string) {
    const region = await this.prisma.region.findUnique({
      where: { id, deletedAt: null },
    });

    if (!region) {
      throw new NotFoundException(`Region with ID ${id} not found or deleted`);
    }

    return { message: 'Region found', data: region };
  }

  async update(id: string, { name, countryId }: UpdateRegionDto) {
    await this.findOne(id);
    await this.countryService.findOne(countryId);
    const updatedRegion = await this.prisma.region.update({
      where: { id },
      data: {
        name,
        countryId,
      },
    });

    return { message: 'Region updated successfully', data: updatedRegion };
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedRegion = await this.prisma.region.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Region soft deleted successfully', data: deletedRegion };
  }
}
