import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe, Req } from '@nestjs/common';
import { FieldService } from './field.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role, Roles, RolesGuard } from '@common';
import { Request } from 'express';

@ApiTags('Fields')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({ version: '1', path: 'field' })
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Post()
  @Roles(Role.OWNER)
  @ApiOperation({ summary: 'Create a new field' })
  create(@Body() createFieldDto: CreateFieldDto, @Req() req: Request) {
    const ownerId = req.user.id;
    return this.fieldService.create(createFieldDto, ownerId);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all fields' })
  findAll() {
    return this.fieldService.findAll();
  }

  @Get('me')
  @Roles(Role.OWNER)
  @ApiOperation({ summary: 'Retrieve all fields owned by the current owner' })
  findAllByOwner(@Req() req: Request) {
    const ownerId = req.user.id;
    return this.fieldService.findAllByOwner(ownerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific field by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.fieldService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.OWNER)
  @ApiOperation({ summary: 'Update a field by ID' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateFieldDto: UpdateFieldDto, @Req() req: Request) {
    const ownerId = req.user.id;
    return this.fieldService.update(id, updateFieldDto, ownerId);
  }

  @Delete(':id')
  @Roles(Role.OWNER)
  @ApiOperation({ summary: 'Soft delete a field by ID (OWNER only)' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const ownerId = req.user.id;
    return this.fieldService.remove(id, ownerId);
  }
}

