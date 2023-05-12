import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/reviewDto';

@Controller('reviews')
export class ReviewsController {
  @UseGuards(JwtGuard)
  @Post()
  createReview(@Body() createReviewDto: CreateReviewDto) {}

  @UseGuards(JwtGuard)
  @Patch('reviewId')
  updateReview(
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: Partial<CreateReviewDto>,
  ) {}

  @Delete()
  deleteReview(@Param('reviewId') reviewId: string) {}
}
