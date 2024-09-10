import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { DistrictService } from './district.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role, Roles, RolesGuard } from '@common';

@ApiTags('Districts')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({ version: '1', path: 'district' })
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Post()
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new district' })
  create(@Body() createDistrictDto: CreateDistrictDto) {
    return this.districtService.create(createDistrictDto);
  }

  @Get()
  @Roles(Role.USER, Role.ADMIN, Role.SUPERADMIN, Role.OWNER)
  @ApiOperation({ summary: 'Retrieve all districts' })
  findAll() {
    return this.districtService.findAll();
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN, Role.SUPERADMIN, Role.OWNER)
  @ApiOperation({ summary: 'Retrieve a specific district by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.districtService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Update a district by ID' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDistrictDto: UpdateDistrictDto) {
    return this.districtService.update(id, updateDistrictDto);
  }

  @Delete(':id')
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Soft delete a district by ID (SUPERADMIN only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.districtService.remove(id);
  }
}
