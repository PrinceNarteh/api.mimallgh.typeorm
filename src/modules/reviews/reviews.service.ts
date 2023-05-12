import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/reviewDto';
import { UserService } from '../users/user.service';
import { ProductService } from '../products/product.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  async getReview(id: string): Promise<Review | null> {
    const review = await this.reviewRepo.findOne({
      where: {
        id,
      },
    });

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
    const user = await this.userService.user(userId);
    const product = await this.productService.product(productId);

    const review = this.reviewRepo.create({
      ...createReviewDto,
      user,
      product,
    });

    await this.reviewRepo.save(review);

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
    const user = await this.userService.user(userId);
    await this.productService.product(productId);
    const review = await this.getReview(reviewId);

    if (user.id !== review.user.id) {
      throw new ForbiddenException('You are not allowed to edit review');
    }

    await this.reviewRepo.update(reviewId, updateReviewDto);

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
    const user = await this.userService.user(userId);
    await this.productService.product(productId);
    const review = await this.getReview(reviewId);

    if (user.id !== review.user.id) {
      throw new ForbiddenException('You are not allowed to edit review');
    }

    await this.reviewRepo.delete(reviewId);

    return 'Review deleted successfully';
  }
}
