import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  ParseUUIDPipe,
  Req,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, UpdateProfileDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesGuard, Role, Roles } from '@common';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({ version: '1', path: 'user' })
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Retrieve all users (SUPERADMIN or ADMIN)' })
  findAll() {
    return this.userService.findAll();
  }

  @Get('profile/me')
  @Roles(Role.USER)
  @ApiOperation({
    summary: 'Retrieve the profile of the currently logged-in user',
  })
  getProfile(@Req() req) {
    const userId = req.user.id;
    return this.userService.findOne(userId);
  }

  @Put('profile/me')
  @Roles(Role.USER)
  @ApiOperation({
    summary: 'Update the profile of the currently logged-in user',
  })
  updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.userService.updateProfile(updateProfileDto, req.user.id);
  }

  @Get(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({
    summary: 'Retrieve a specific user by ID (SUPERADMIN or ADMIN)',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Update a user by ID (SUPERADMIN only)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Soft delete a user by ID (SUPERADMIN only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
}
