import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '@prisma';
import { UpdateProfileDto, UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateUserDto) {
    const { fullname, phone_number, password } = payload;
    const hashedPassword = await hash(password, 10);

    const user = await this.prisma.users.create({
      data: {
        fullname,
        phone_number,
        password: hashedPassword,
      },
    });
    return { message: 'User created successfully', data: user };
  }

  async findAll() {
    const allUsers = await this.prisma.users.findMany({
      where: {
        deletedAt: null,
      },
    });
    return { message: 'All users', data: allUsers };
  }

  async findOne(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return { message: 'User found', data: user };
  }

  async updateProfile(payload: UpdateProfileDto, userId: string) {
    const { fullname, phone_number, password } = payload;

    const user = await this.findOne(userId);

    const hashedPassword = password ? await hash(password, 10) : user.data.password;

    const updatedUser = await this.prisma.users.update({
      where: { id: userId },
      data: {
        fullname,
        phone_number,
        password: hashedPassword,
      },
    });

    return { message: 'User profile updated successfully', data: updatedUser };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    const { password, ...rest } = updateUserDto;
    const hashedPassword = password ? await hash(password, 10) : user.data.password;

    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: {
        ...rest,
        password: hashedPassword,
      },
    });

    return { message: 'User successfully updated', data: updatedUser };
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    const deletedUser = await this.prisma.users.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    this.logger.log(`User with ID ${id} deleted (soft delete)`);
    return { message: 'User deleted successfully', data: deletedUser };
  }

  private async findUserById(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException(`User with ID ${id} not found or already deleted`);
    }

    return user;
  }
}
