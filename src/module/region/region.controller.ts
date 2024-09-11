import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role, Roles, RolesGuard } from '@common';

@ApiTags('Regions')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({ version: '1', path: 'region' })
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Post()
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new region' })
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionService.create(createRegionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all regions' })
  findAll() {
    return this.regionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific region by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.regionService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Update a region by ID' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionService.update(id, updateRegionDto);
  }

  @Delete(':id')
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Soft delete a region by ID (SUPERADMIN only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.regionService.remove(id);
  }
}
