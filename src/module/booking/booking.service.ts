import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  // Check if booking times are available
  private async isBookingTimeAvailable(fieldId: string, start_time: Date, end_time: Date, excludeBookingId?: string) {
    const existingBookings = await this.prisma.booking.findMany({
      where: {
        fieldId,
        start_time: { lt: end_time },
        end_time: { gt: start_time },
        deletedAt: null,
        ...(excludeBookingId && { id: { not: excludeBookingId } }), // Exclude the current booking in case of an update
      },
    });

    return existingBookings.length === 0;
  }

  // Create booking
  async create(createBookingDto: CreateBookingDto, userId: string) {
    const { booking_date, start_time, end_time, fieldId } = createBookingDto;

    // Validate if the field exists
    const field = await this.prisma.field.findUnique({ where: { id: fieldId } });
    if (!field) throw new NotFoundException('Field not found');

    // Validate if the booking time is available
    const isAvailable = await this.isBookingTimeAvailable(fieldId, new Date(start_time), new Date(end_time));
    if (!isAvailable) {
      throw new BadRequestException('The selected time is already booked.');
    }

    // Create the booking
    const booking = await this.prisma.booking.create({
      data: {
        booking_date: new Date(booking_date),
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        fieldId,
        userId,
        status: createBookingDto.status || 'PENDING',
      },
    });

    return { message: 'Booking created successfully', data: booking };
  }

  // Update booking (User can update, but not status; Owner can update status)
  async update(id: string, updateBookingDto: UpdateBookingDto, userId: string, role: string) {
    const { start_time, end_time, fieldId, status } = updateBookingDto;

    const booking = await this.findOne(id);

    // Check if the booking belongs to the user or if the user is the owner of the field
    if (booking.userId !== userId) {
      const field = await this.prisma.field.findUnique({ where: { id: booking.fieldId } });
      if (field.ownerId !== userId || role !== 'OWNER') {
        throw new ForbiddenException('You are not allowed to update this booking.');
      }
    }

    // Users are not allowed to update the status
    if (role === 'USER' && status) {
      throw new ForbiddenException('You are not allowed to update the booking status.');
    }

    // Check if the booking time is available for update (for users and owners)
    if (start_time && end_time && fieldId) {
      const isAvailable = await this.isBookingTimeAvailable(
        fieldId,
        new Date(start_time),
        new Date(end_time),
        id, // Exclude current booking from the check
      );
      if (!isAvailable) {
        throw new BadRequestException('The selected time is already booked.');
      }
    }

    // Update booking
    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        ...updateBookingDto,
        booking_date: updateBookingDto.booking_date ? new Date(updateBookingDto.booking_date) : undefined,
        start_time: updateBookingDto.start_time ? new Date(updateBookingDto.start_time) : undefined,
        end_time: updateBookingDto.end_time ? new Date(updateBookingDto.end_time) : undefined,
        status: role === 'OWNER' ? status : undefined, 
      },
    });

    return { message: 'Booking updated successfully', data: updatedBooking };
  }

  // Remove (cancel) booking
  async remove(id: string, userId: string) {
    const booking = await this.findOne(id);

    // Ensure user is the owner of the booking
    if (booking.userId !== userId) {
      throw new ForbiddenException('You are not allowed to cancel this booking.');
    }

    // Check if the booking is at least 3 hours before the start time
    const now = new Date();
    const threeHoursBeforeStartTime = new Date(booking.start_time.getTime() - 3 * 60 * 60 * 1000);
    if (now >= threeHoursBeforeStartTime) {
      throw new BadRequestException('You can only cancel a booking at least 3 hours before the start time.');
    }

    await this.prisma.booking.delete({
      where: { id },
    });

    return { message: 'Booking canceled successfully' };
  }

  // Find a booking by ID
  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        field: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  // Get all bookings for admins
  async findAll() {
    const bookings = await this.prisma.booking.findMany({
      include: {
        user: true,
        field: true,
      },
    });
    return { message: 'All bookings retrieved', data: bookings };
  }

  // Get bookings for the current user
  async findAllByUser(userId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
      include: {
        user: true,
        field: true,
      },
    });
    return { message: 'Your bookings retrieved', data: bookings };
  }

  // Get bookings for the owner's fields
  async findAllByOwner(ownerId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        field: {
          ownerId,
        },
      },
      include: {
        user: true,
        field: true,
      },
    });
    return { message: 'Bookings for your fields retrieved', data: bookings };
  }
}
