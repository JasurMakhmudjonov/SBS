import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role, Roles, RolesGuard } from '@common';

@ApiTags('Countries')
@Controller({ version: '1', path: 'country' })
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new country' })
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countryService.create(createCountryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all countries' })
  findAll() {
    return this.countryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific country by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.countryService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Update a country by ID' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ) {
    return this.countryService.update(id, updateCountryDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Soft delete a country by ID (SUPERADMIN only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.countryService.remove(id);
  }
}
