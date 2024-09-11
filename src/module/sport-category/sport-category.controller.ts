import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SportCategoryService } from './sport-category.service';
import { CreateSportCategoryDto } from './dto/create-sport-category.dto';
import { UpdateSportCategoryDto } from './dto/update-sport-category.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role, Roles, RolesGuard } from '@common';

@ApiTags('Sport Categories')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({ version: '1', path: 'sport-category' })
export class SportCategoryController {
  constructor(private readonly sportCategoryService: SportCategoryService) {}

  @Post()
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new sport category' })
  create(@Body() createSportCategoryDto: CreateSportCategoryDto) {
    return this.sportCategoryService.create(createSportCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all sport categories' })
  findAll() {
    return this.sportCategoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific sport category by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.sportCategoryService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Update a sport category by ID' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSportCategoryDto: UpdateSportCategoryDto,
  ) {
    return this.sportCategoryService.update(id, updateSportCategoryDto);
  }

  @Delete(':id')
  @Roles(Role.SUPERADMIN)
  @ApiOperation({
    summary: 'Soft delete a sport category by ID (SUPERADMIN only)',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.sportCategoryService.remove(id);
  }
}
