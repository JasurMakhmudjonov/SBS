import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role, Roles, RolesGuard } from '@common';
import { Request } from 'express';

@ApiTags('Reviews')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({ version: '1', path: 'reviews' })
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Create a new review (USER only)' })
  create(@Body() createReviewDto: CreateReviewDto, @Req() req: Request) {
    const userId = req.user.id;
    return this.reviewService.create(userId, createReviewDto);
  }

  @Get()
  @Roles(Role.USER, Role.ADMIN, Role.SUPERADMIN, Role.OWNER)
  @ApiOperation({ summary: 'Retrieve all reviews' })
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN, Role.SUPERADMIN, Role.OWNER)
  @ApiOperation({ summary: 'Retrieve a specific review by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  @Roles('USER')
  @ApiOperation({ summary: 'Update a review by ID (USER only)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReviewDto: CreateReviewDto,
    @Req() req: Request,
  ) {
    const userId = req.user.id;
    return this.reviewService.update(id, userId, updateReviewDto);
  }

  @Delete(':id')
  @Roles('USER')
  @ApiOperation({ summary: 'Delete a review by ID (USER only)' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const userId = req.user.id;
    return this.reviewService.remove(id, userId);
  }
}
