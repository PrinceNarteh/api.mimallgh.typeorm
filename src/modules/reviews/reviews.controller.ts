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
import { CreateReviewDto } from './dto/reviewDto';
import { ReviewsService } from './reviews.service';
import { UserDocument } from '../users/schema/user.schema';
import { JwtGuard } from '../users/auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

  @Get()
  async getAllReviews() {
    return await this.reviewService.getAllReviews();
  }

  @Get('reviewId')
  async getReview(@Param('reviewId') reviewId: string) {
    return this.reviewService.getReview(reviewId);
  }

  @UseGuards(JwtGuard)
  @Post(':productId')
  async createReview(
    @Param('productId') productId: string,
    @Request() user: UserDocument,
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
    @Request() user: UserDocument,
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
