import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe, Req } from '@nestjs/common';
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

  // Create a new booking (for users)
  @Post()
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Create a new booking' })
  create(@Body() createBookingDto: CreateBookingDto, @Req() req: Request) {
    const userId = req.user.id; // Get userId from JWT token
    return this.bookingService.create(createBookingDto, userId);
  }

  // Get all bookings (for admins)
  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: 'Get all bookings (Admin only)' })
  findAll() {
    return this.bookingService.findAll();
  }

  // Get bookings for the current user
  @Get('me')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Get all your bookings' })
  findAllByUser(@Req() req: Request) {
    const userId = req.user.id;
    return this.bookingService.findAllByUser(userId);
  }

  // Get bookings for the owner's fields
  @Get('owner/me')
  @Roles(Role.OWNER)
  @ApiOperation({ summary: 'Get all bookings for your fields (Owner only)' })
  findAllByOwner(@Req() req: Request) {
    const ownerId = req.user.id;
    return this.bookingService.findAllByOwner(ownerId);
  }

  // Get a booking by ID
  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: 'Get a booking by ID (Admin only)' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingService.findOne(id);
  }

  // Update a booking
  @Patch(':id')
  @Roles(Role.USER, Role.OWNER)
  @ApiOperation({ summary: 'Update a booking' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBookingDto: UpdateBookingDto, @Req() req: Request) {
    const userId = req.user.id;
    const role = req.user.role;
    return this.bookingService.update(id, updateBookingDto, userId, role);
  }

  // Cancel a booking (users)
  @Delete(':id')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Cancel a booking' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const userId = req.user.id;
    return this.bookingService.remove(id, userId);
  }
}
