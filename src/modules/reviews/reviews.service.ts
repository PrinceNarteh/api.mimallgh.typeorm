import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from '../products/product.service';
import { UserService } from '../users/user.service';
import { CreateReviewDto } from './dto/reviewDto';
import { ReviewRepository } from './reviews.repository';
import { ReviewDocument } from './schema/review.schema';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly productService: ProductService,
    private readonly reviewRepo: ReviewRepository,
    private readonly userService: UserService,
  ) {}

  async getAllReviews(): Promise<ReviewDocument[]> {
    return this.reviewRepo.find({});
  }

  async getReview(id: string): Promise<ReviewDocument | null> {
    const review = await this.reviewRepo.findById(id);

    if (!review) {
      throw new NotFoundException('Review Not Found');
    }

    return review;
  }

  async createReview({
    userId,
    productId,
    createReviewDto,
  }: {
    userId: string;
    productId: string;
    createReviewDto: CreateReviewDto;
  }) {
    const user = await this.userService.getUser(userId);
    const product = await this.productService.getProduct(productId);

    const review = this.reviewRepo.create({
      ...createReviewDto,
      user,
      product,
    });

    return review;
  }

  async updateReview({
    reviewId,
    userId,
    productId,
    updateReviewDto,
  }: {
    reviewId: string;
    userId: string;
    productId: string;
    updateReviewDto: Partial<CreateReviewDto>;
  }) {
    const user = await this.userService.getUser(userId);
    await this.productService.getProduct(productId);
    const review = await this.getReview(reviewId);

    if (user.id !== review.user.email) {
      throw new ForbiddenException('You are not allowed to edit review');
    }

    await this.reviewRepo.findByIdAndUpdate(reviewId, updateReviewDto);

    return this.getReview(reviewId);
  }

  async deleteReview({
    reviewId,
    userId,
    productId,
  }: {
    reviewId: string;
    userId: string;
    productId: string;
    updateReviewDto: Partial<CreateReviewDto>;
  }) {
    const user = await this.userService.getUser(userId);
    await this.productService.getProduct(productId);
    const review = await this.reviewRepo.findById(reviewId);

    if (user.id !== review.user) {
      throw new ForbiddenException('You are not allowed to edit review');
    }

    await this.reviewRepo.delete(reviewId);

    return 'Review deleted successfully';
  }
}
