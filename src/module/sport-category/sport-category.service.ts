import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSportCategoryDto } from './dto/create-sport-category.dto';
import { UpdateSportCategoryDto } from './dto/update-sport-category.dto';
import { PrismaService } from '@prisma';

@Injectable()
export class SportCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ name }: CreateSportCategoryDto) {
    const existsCategory = await this.prisma.sportCategory.findUnique({
      where: { name },
    });

    if (existsCategory) {
      throw new NotFoundException(
        `Sport category with name "${name}" already exists`,
      );
    }

    const category = await this.prisma.sportCategory.create({
      data: { name },
    });

    return { message: 'Sport category created successfully', data: category };
  }

  async findAll() {
    const categories = await this.prisma.sportCategory.findMany({
      where: { deletedAt: null },
    });

    return { message: 'All sport categories', data: categories };
  }

  async findOne(id: string) {
    const category = await this.prisma.sportCategory.findUnique({
      where: { id, deletedAt: null },
    });

    if (!category) {
      throw new NotFoundException(`Sport category with ID ${id} not found`);
    }

    return { message: 'Sport category found', data: category };
  }

  async update(id: string, updateSportCategoryDto: UpdateSportCategoryDto) {
    await this.findOne(id);

    const updatedCategory = await this.prisma.sportCategory.update({
      where: { id },
      data: updateSportCategoryDto,
    });

    return {
      message: 'Sport category updated successfully',
      data: updatedCategory,
    };
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedCategory = await this.prisma.sportCategory.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return {
      message: 'Sport category soft deleted successfully',
      data: deletedCategory,
    };
  }
}
