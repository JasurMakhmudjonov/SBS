import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { DistrictService, SportCategoryService, UsersService } from '@module';
import { PrismaService } from '@prisma';

@Injectable()
export class FieldService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly districtService: DistrictService,
    private readonly sportCategoryService: SportCategoryService,
    private readonly userService: UsersService,
  ) {}

  async create(createFieldDto: CreateFieldDto, ownerId: string) {
    const { categoryId, districtId, location, ...rest } =
      createFieldDto;

    await this.districtService.findOne(districtId);
    await this.sportCategoryService.findOne(categoryId);

    const field = await this.prisma.field.create({
      data: {
        ...rest,
        ownerId,
        location: JSON.stringify(location),
        categoryId,
        districtId,
      },
      include: {
        category: true,
        district: true,
      },
    });

    return { message: 'Field created successfully', data: field };
  }

  async findAll() {
    const fields = await this.prisma.field.findMany({
      where: { deletedAt: null },
      include: {
        category: true,
        district: true,
      },
    });
    return { message: 'All fields', data: fields };
  }

  async findOne(id: string) {
    const field = await this.prisma.field.findUnique({
      where: { id, deletedAt: null },
      include: {
        category: true,
        district: true,
      },
    });

    if (!field) {
      throw new NotFoundException(`Field with ID ${id} not found`);
    }

    return { message: 'Field found', data: field };
  }

  async update(id: string, updateFieldDto: UpdateFieldDto, ownerId: string) {
    const { categoryId, districtId, location, ...rest } = updateFieldDto;

    const existingField = await this.findOne(id);

    if (existingField.data.ownerId !== ownerId) {
      throw new ForbiddenException('You are not allowed to update this field');
    }

    const updatedField = await this.prisma.field.update({
      where: { id },
      data: {
        ...rest,
        location: location ? JSON.stringify(location) : undefined,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        district: districtId ? { connect: { id: districtId } } : undefined,
      },
      include: {
        category: true,
        district: true,
      },
    });

    return { message: 'Field updated successfully', data: updatedField };
  }

  async remove(id: string, ownerId: string) {
    const field = await this.findOne(id);

    if (field.data.ownerId !== ownerId) {
      throw new ForbiddenException('You are not allowed to delete this field');
    }

    const deletedField = await this.prisma.field.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Field soft deleted successfully', data: deletedField };
  }
}
