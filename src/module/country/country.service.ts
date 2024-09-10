import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { PrismaService } from '@prisma';

@Injectable()
export class CountryService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ name }: CreateCountryDto) {
    const existsCountry = await this.prisma.country.findUnique({
      where: { name },
    });
    if (existsCountry) {
      throw new BadRequestException('Country already exists');
    }
    const country = await this.prisma.country.create({ data: { name } });
    return { message: 'Country created successfully', data: country };
  }

  async findAll() {
    const countries = await this.prisma.country.findMany({
      where: { deletedAt: null },
    });
    return { message: 'All countries', data: countries };
  }

  async findOne(id: string) {
    const country = await this.prisma.country.findUnique({
      where: { id, deletedAt: null }, 
    });

    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }

    return { message: 'Country found', data: country };
  }

  async update(id: string, updateCountryDto: UpdateCountryDto) {
    await this.findOne(id); // Ensure the country exists
    const updatedCountry = await this.prisma.country.update({
      where: { id },
      data: updateCountryDto,
    });

    return { message: 'Country updated successfully', data: updatedCountry };
  }

  async remove(id: string) {
    await this.findOne(id); 

    const deletedCountry = await this.prisma.country.update({
      where: { id },
      data: { deletedAt: new Date() }, 
    });

    return { message: 'Country soft deleted successfully', data: deletedCountry };
  }
}
