import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createReviewDto: CreateReviewDto) {
    const { fieldId, rating, comment } = createReviewDto;

    const confirmedBooking = await this.prisma.booking.findFirst({
      where: {
        userId: userId,
        fieldId: fieldId,
        status: 'CONFIRMED', 
        deletedAt: null,    
      },
    });

    if (!confirmedBooking) {
      throw new ForbiddenException(
        'You can only review stadiums you have booked with a confirmed booking status.'
      );
    }

    const review = await this.prisma.reviews.create({
      data: {
        rating,
        comment,
        fieldId,
        userId,
      },
    });

    return { message: 'Review created successfully', data: review };
  }

  async findAll() {
    return this.prisma.reviews.findMany({
      where: { deletedAt: null },
      include: { field: true, user: true },
    });
  }

  async findOne(id: string) {
    const review = await this.prisma.reviews.findUnique({
      where: { id, deletedAt: null },
      include: { field: true, user: true },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return { message: 'Review found', data: review };
  }

  async update(id: string, userId: string, updateReviewDto: any) {
    const existingReview = await this.findOne(id);

    if (existingReview.data.userId !== userId) {
      throw new ForbiddenException('You are not allowed to update this review');
    }

    const updatedReview = await this.prisma.reviews.update({
      where: { id },
      data: {
        ...updateReviewDto,
        updatedAt: new Date(),
      },
    });

    return { message: 'Review updated successfully', data: updatedReview };
  }

  async remove(id: string, userId: string) {
    const existingReview = await this.findOne(id);

    if (existingReview.data.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this review');
    }

    const deletedReview = await this.prisma.reviews.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Review soft deleted successfully', data: deletedReview };
  }
}
