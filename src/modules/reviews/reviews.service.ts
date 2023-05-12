import { Injectable } from '@nestjs/common';
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
}
