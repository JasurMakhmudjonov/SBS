import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseUUIDPipe, Req, Put } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles, RolesGuard } from '@common';
import { Request } from 'express';
import { Role } from '@common';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({ version: '1', path: 'booking' })
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Create a new booking' })
  create(@Body() createBookingDto: CreateBookingDto, @Req() req: Request) {
    const userId = req.user.id; 
    return this.bookingService.create(createBookingDto, userId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: 'Get all bookings (Admin only)' })
  findAll() {
    return this.bookingService.findAll();
  }

  @Get('me')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Get all your bookings' })
  findAllByUser(@Req() req: Request) {
    const userId = req.user.id;
    return this.bookingService.findAllByUser(userId);
  }

  @Get('owner/me')
  @Roles(Role.OWNER)
  @ApiOperation({ summary: 'Get all bookings for your fields (Owner only)' })
  findAllByOwner(@Req() req: Request) {
    const ownerId = req.user.id;
    return this.bookingService.findAllByOwner(ownerId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: 'Get a booking by ID (Admin only)' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.USER, Role.OWNER)
  @ApiOperation({ summary: 'Update a booking' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBookingDto: UpdateBookingDto, @Req() req: Request) {
    const userId = req.user.id;
    const role = req.user.role;
    return this.bookingService.update(id, updateBookingDto, userId, role);
  }

  @Put(':id/cancel')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Cancel a booking' })
  cancel(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const userId = req.user.id;
    return this.bookingService.cancel(id, userId);
  }
}
