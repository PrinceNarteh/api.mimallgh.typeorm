import {
  Body,
  Controller,
  Delete,
  Param,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/reviewDto';
import { ReviewsService } from './reviews.service';
import { User } from 'src/entities/user.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

  @Get('reviewId')
  async getReview(@Param('reviewId') reviewId: string) {
    return this.reviewService.getReview(reviewId);
  }

  @UseGuards(JwtGuard)
  @Post(':productId')
  async createReview(
    @Param('productId') productId: string,
    @Request() user: User,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewService.createReview({
      productId,
      userId: user.id,
      createReviewDto,
    });
  }

  @UseGuards(JwtGuard)
  @Patch(':reviewId/product/:productId')
  updateReview(
    @Param('reviewId') reviewId: string,
    @Param('productId') productId: string,
    @Request() user: User,
    @Body() updateReviewDto: Partial<CreateReviewDto>,
  ) {
    return this.reviewService.updateReview({
      reviewId,
      productId,
      userId: user.id,
      updateReviewDto,
    });
  }

  @Delete()
  deleteReview(@Param('reviewId') reviewId: string) {}
}
